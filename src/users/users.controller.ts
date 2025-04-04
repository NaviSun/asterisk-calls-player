import { Controller, Post, Body, Get, Query, UsePipes, ValidationPipe, Param, Patch, UseFilters, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UserResponse } from './dto/response.dto';
import { UpdateUserDto, ChangePasswordDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { UserEntity } from './entities/user.entity';
import { UserRole } from './user-role.enum';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Request } from 'express';


@ApiTags('Users')
@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({
    summary: 'Создание нового пользователя',
    description: 'Регистрирует нового пользователя в системе. Пароль будет захеширован перед сохранением.'
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      basic: {
        summary: 'Базовый пример',
        value: {
          firstName: 'Иван',
          lastName: 'Иванов',
          email: 'user@example.com',
          password: 'securePassword123'
        }
      },
      admin: {
        summary: 'Создание администратора',
        value: {
          firstName: 'Админ',
          lastName: 'Системный',
          email: 'admin@example.com',
          password: 'adminPassword123',
          role: 'admin'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно создан',
    type: UserResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные: невалидный email, короткий пароль и т.д.'
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует'
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Поиск пользователя по email',
    description: 'Возвращает информацию о пользователе по его email адресу'
  })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Email адрес пользователя',
    example: 'user@example.com'
  })
  @ApiResponse({
    status: 200,
    description: 'Найденный пользователь',
    type: UserResponse
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден'
  })
  async findUser(@Query('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(HttpExceptionFilter)
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request
  ) {
    return this.usersService.updateUser(id, updateUserDto, req);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Throttle({default: {limit: 5, ttl: 3600}}) // 5 попыток в час
  @UseFilters(HttpExceptionFilter)
  @ApiOperation({ summary: 'Сменить пароль' })
  async changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request
  ) {
    return this.usersService.changePassword(id, changePasswordDto, req);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseFilters(HttpExceptionFilter)
  @ApiOperation({ summary: 'Изменить статус пользователя (admin only)' })
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateUserStatusDto,
    @User() currentUser: UserEntity
  ) {
    return this.usersService.updateStatus(id, updateStatusDto, currentUser);
  }

}
