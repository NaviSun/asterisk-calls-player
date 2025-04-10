import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString, IsOptional, IsEmail, MinLength, IsEnum, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


// Базовый DTO для обновления основных данных
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Иван' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Иванов' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ 
    type: [Number],
    description: 'Array of role IDs',
    example: [1, 2] 
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  roleIds?: number[];
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