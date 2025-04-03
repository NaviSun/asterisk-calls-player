import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create User in DataBase' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Create User Whith passwordHash'
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(this.configService.get('SALT'));
    const passwordHash = await bcrypt.hash(createUserDto.passwordHash, salt)
    createUserDto.passwordHash = passwordHash;
    createUserDto.createdAt = new Date();

    return this.usersService.create(createUserDto);
  }


  @Get('me')
  @ApiOperation({ summary: 'find User by email' })
  @ApiBody({
    type: 'object', schema: {
      default: 'test@test.ru',
      example: 'test@test.ru',
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Find User in DataBase'
  })
  findUser(@Body('email') email: string) {
    return this.usersService.findOne(email);
  }


}
