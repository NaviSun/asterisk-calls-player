
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ 
      example: 'securePassword123', 
      description: 'Пароль (минимум 8 символов)',
      minLength: 8
    })
    @MinLength(8)
    password: string;
  
    @ApiProperty({ 
      required: false,
      enum: ['create_user', 'find_user', 'update_user'],
      default: '',
      description: 'Роль пользователя' 
    })
    roles: [string];
  }
