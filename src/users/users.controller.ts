import { Controller, Body, Get, Query, UsePipes, ValidationPipe, Param, Patch, UseFilters, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth,} from '@nestjs/swagger';
import { UpdateUserDto, ChangePasswordDto, UpdateUserStatusDto, UpdateUserAvatarDto } from './dto/update-user.dto';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { Premissions } from 'src/role/decorators/premissions.decorator';
import { Premission } from 'src/role/premission.type';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';


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
  @Premissions(Premission.FindUser)
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
  @Premissions(Premission.UpdateUser)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }
    /* 
      ==== Обновить аватар пользователя
  */
  @Patch(':id/avatar')
  @ApiOperation({ summary: 'Обновить Аватар пользователя' })
  async updateAvatar(
    @Param('id') id: number,
    @Body() updateAvatarDto: UpdateUserAvatarDto,
  ) {
    return this.usersService.updateAvatar(id, updateAvatarDto);
  }

  /* 
    === Смена пароля
  */
  @Premissions(Premission.UpdateUser)
  @Patch(':id/password')
  @UseGuards( ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 3600 } }) // 5 попыток в час
  @ApiOperation({ summary: 'Сменить пароль' })
  async changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  /* 
    === Смена статуса пользователя banned
  */
  @Patch(':id/status')
  @Premissions(Premission.UpdateUser)
  @UseFilters(HttpExceptionFilter)
  @ApiOperation({ summary: 'Изменить статус пользователя' })
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, updateStatusDto);
  } 

}
