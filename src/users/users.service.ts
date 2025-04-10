import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  UpdateUserDto,
  ChangePasswordDto,
  UpdateUserStatusDto,
  AdminUpdateUserDto,
  UpdateUserAvatarDto
} from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { RoleService } from 'src/role/role.service';
import { RoleEntity } from 'src/role/entity/role.entity';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly roleService: RoleService
  ) { }

  /* 
    Поиск пользователя по Email
  */

  async findOne(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email }, relations: ['roles', 'roles.permissions'] });
  }
  /* 
    ==== Обновление данных пользователя
  */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles']
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    // 2. Обновляем только переданные поля
    const updatetedUser = this.applyUserUpdates(user, updateUserDto);

    // 3. Обработка ролей (если переданы)
    if (updateUserDto.roleIds !== undefined) {
      const roles = await this.updateUserRoles(updateUserDto.roleIds);
      updatetedUser.roles = roles;
    }

    // 6. Сохраняем обновленные данные
    return this.userRepository.save(updatetedUser);
  }
  private applyUserUpdates(user: UserEntity, dto: UpdateUserDto): UserEntity {
    if (dto.firstName !== undefined) {
      user.firstName = dto.firstName;
    }

    if (dto.lastName !== undefined) {
      user.lastName = dto.lastName;
    }

    if (dto.email !== undefined && dto.email !== user.email) {
      this.checkEmailUniqueness(dto.email);
      user.email = dto.email;
    }
    return user;
  }

  private async updateUserRoles(roleIds: number[]): Promise<RoleEntity[]> {
    // Если передали пустой массив - очищаем роли
    if (roleIds.length === 0) {
      return [];
    }

    // Находим все указанные роли
    const roles = await this.roleService.findRoleById(roleIds);

    // Проверяем, что все роли найдены
    if (roles.length !== roleIds.length) {
      const foundIds = roles.map(role => role.id);
      const missingIds = roleIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(
        `Роли с ID ${missingIds.join(', ')} не найдены`
      );
    }

    return roles;
  }

  /* 
  ===== Обновление Аватар Пользователя
  */

  async updateAvatar(id: number, updateAvatarDto: UpdateUserAvatarDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.avatar = updateAvatarDto.avatar;
    return this.userRepository.save(user);
  }
  /* 
    ===== Смена пароля пользователя
  */
  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserEntity> {

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