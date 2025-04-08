import { Controller, Body, Get, Query, UsePipes, ValidationPipe, Param, Patch, UseFilters, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth,} from '@nestjs/swagger';
import { UserResponse } from './dto/response.dto';
import { UpdateUserDto, ChangePasswordDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { Request } from 'express';


@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  /* 
      +=== Поиск пользователя по email ===
  */
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

  /* 
      ==== Обновить данные пользователя
  */

     

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request
  ) {
    return this.usersService.updateUser(id, updateUserDto, req);
  }

  /* 
    === Смена пароля
  */

  @Patch(':id/password')
  @UseGuards( ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 3600 } }) // 5 попыток в час
  @ApiOperation({ summary: 'Сменить пароль' })
  async changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request
  ) {
    return this.usersService.changePassword(id, changePasswordDto, req);
  }

  /* 
    === Смена статуса пользователя banned
  */
/*   @Patch(':id/status')
  @UseGuards( RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseFilters(HttpExceptionFilter)
  @ApiOperation({ summary: 'Изменить статус пользователя (admin only)' })
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateUserStatusDto,
    @UserId() currentUser: UserEntity
  ) {
    return this.usersService.updateStatus(id, updateStatusDto, currentUser);
  } */

}
