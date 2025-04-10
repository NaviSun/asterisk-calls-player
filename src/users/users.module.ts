import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { RoleService } from 'src/role/role.service';
import { RoleModule } from 'src/role/role.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10,
    }]),
    RoleModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [UsersService]
})

export class UsersModule {}
