import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsDate, IsString, IsOptional, IsEmail, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

// Базовый DTO для обновления основных данных
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ 
    enum: UserRole,
    example: UserRole.USER,
    description: 'Роль пользователя',
    required: false 
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

// DTO для обновления аватара
export class UpdateUserAvatarDto {
  @ApiProperty({ 
    description: 'URL аватара пользователя',
    example: 'https://example.com/avatar.jpg',
    required: true 
  })
  @IsString()
  avatar: string;
}

// DTO для смены пароля
export class ChangePasswordDto {
  @ApiProperty({ 
    description: 'Текущий пароль',
    example: 'oldPassword123',
    required: true 
  })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({ 
    description: 'Новый пароль',
    example: 'newSecurePassword456',
    required: true 
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

// DTO для блокировки/разблокировки пользователя
export class UpdateUserStatusDto {
  @ApiProperty({ 
    description: 'Заблокирован ли пользователь',
    example: true,
    required: true 
  })
  @IsBoolean()
  banned: boolean;

  @ApiProperty({ 
    description: 'Причина блокировки',
    example: 'Нарушение правил',
    required: false 
  })
  @IsOptional()
  @IsString()
  banReason?: string;
}

// DTO для административного обновления
export class AdminUpdateUserDto extends UpdateUserDto {
  @ApiProperty({ 
    description: 'Дата последнего обновления',
    example: '2023-01-01T00:00:00.000Z',
    required: false 
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}