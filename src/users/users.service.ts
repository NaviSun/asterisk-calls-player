import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  UpdateUserDto,
  ChangePasswordDto,
  UpdateUserStatusDto,
  AdminUpdateUserDto
} from './dto/update-user.dto';
import { Request } from 'express';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  /* 
    Поиск пользователя по Email
  */

  async findOne(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }
  /* 
    ==== Обновление данных пользователя
  */
  async updateUser(id: number, updateUserDto: UpdateUserDto, req: Request): Promise<UserEntity> {
    /* this.validateUserAccess(id, req); */

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


  /* 
  ===== Обновление Аватар Пользователя
  */

  async updateAvatar(id: number, avatar: string, req: Request): Promise<UserEntity> {
    /* this.validateUserAccess(id, req); */

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.avatar = avatar;
    return this.userRepository.save(user);
  }
  /* 
    ===== Смена пароля пользователя
  */
  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
    req: Request
  ): Promise<UserEntity> {
    /*  this.validateUserAccess(id, req); */

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.validateCurrentPassword(user, changePasswordDto.currentPassword);

    const salt = await bcrypt.genSalt();
    user.passwordHash = await bcrypt.hash(changePasswordDto.newPassword, salt);
    user.updatedAt = new Date();

    await this.userRepository.save(user);
    return user;
  }

  /* 
    ==== Обновить статус доступа banned 
  */

  async updateStatus(
    id: number,
    updateStatusDto: UpdateUserStatusDto,
    currentUser: UserEntity
  ): Promise<UserEntity> {

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.banned = updateStatusDto.banned;
    if (updateStatusDto.banReason !== undefined) {
      user.banReason = updateStatusDto.banned ? updateStatusDto.banReason : '';
    }

    return this.userRepository.save(user);
  }

  /* 
    ======== Обновление данных пользователя
  */
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

}