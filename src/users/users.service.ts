import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException,
  ForbiddenException,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  UpdateUserDto,
  ChangePasswordDto,
  UpdateUserStatusDto,
  AdminUpdateUserDto
} from './dto/update-user.dto';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private getValidRole(role?: string): UserRole {
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      return role as UserRole;
    }
    return UserRole.USER;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, ...rest } = createUserDto;
    
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Вариант 1: с использованием create()
    const userData: DeepPartial<UserEntity> = {
      ...rest,
      email,
      passwordHash,
      role: this.getValidRole(createUserDto.role),
      banned: false,
      banReason: null,
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user = this.userRepository.create(userData);


    return await this.userRepository.save(user);
  }

  async findOne(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, req: Request): Promise<UserEntity> {
    this.validateUserAccess(id, req);
    
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.checkEmailUniqueness(updateUserDto.email);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateAvatar(id: number, avatar: string, req: Request): Promise<UserEntity> {
    this.validateUserAccess(id, req);
    
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.avatar = avatar;
    return this.userRepository.save(user);
  }

  async changePassword(
    id: number, 
    changePasswordDto: ChangePasswordDto, 
    req: Request
  ): Promise<UserEntity> {
    this.validateUserAccess(id, req);
    
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.validatePasswordAttempts(user);
    await this.validateCurrentPassword(user, changePasswordDto.currentPassword);

    const salt = await bcrypt.genSalt();
    user.passwordHash = await bcrypt.hash(changePasswordDto.newPassword, salt);
    user.updatedAt = new Date();
    
    await this.userRepository.save(user);
    await this.invalidateAllTokens(user.id);
    
    return user;
  }

  async updateStatus(
    id: number, 
    updateStatusDto: UpdateUserStatusDto,
    currentUser: UserEntity
  ): Promise<UserEntity> {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Only admin can update user status');
    }

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.banned = updateStatusDto.banned;
    if(updateStatusDto.banReason !== undefined){
      user.banReason = updateStatusDto.banned ? updateStatusDto.banReason : null;
    }

    if (updateStatusDto.banned) {
      await this.invalidateAllTokens(user.id);
    }

    return this.userRepository.save(user);
  }

  async adminUpdateUser(
    id: number, 
    adminUpdateDto: AdminUpdateUserDto,
    currentUser: UserEntity
  ): Promise<UserEntity> {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Only admin can perform this action');
    }

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, adminUpdateDto);
    return this.userRepository.save(user);
  }

  // ============ Вспомогательные методы безопасности ============
  private async checkEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  }

  private validateUserAccess(userId: number, req: Request): void {
    if (!req.user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
  
    const tokenUserId = req.user.id;
    
    if (userId !== tokenUserId) {
      throw new ForbiddenException('Вы можете изменять только свой профиль');
    }
  }

  private async validateCurrentPassword(
    user: UserEntity, 
    currentPassword: string
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
  }

  private async validatePasswordAttempts(user: UserEntity): Promise<void> {
    // Здесь можно добавить проверку попыток смены пароля
    // Например, используя Redis для хранения счетчика попыток
    // if (user.passwordAttempts >= this.PASSWORD_ATTEMPTS_LIMIT) {
    //   throw new TooManyRequestsException('Too many password attempts');
    // }
  }

  private async invalidateAllTokens(userId: number): Promise<void> {
    // Здесь можно добавить логику инвалидации токенов
    // Например, добавляя запись в Redis или увеличивая счетчик токенов
    this.logger.log(`Invalidated all tokens for user ${userId}`);
  }
}