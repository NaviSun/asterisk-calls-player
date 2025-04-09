import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import jwtConfig from '../config/jwt.config';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/jwt-auth.guard';
import { AuthenticationGuard } from './decorators/authetication.decorar';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage/refresh-token-ids.storage';

import { PremissionGuard } from './../role/guards/premissions.guard';
import { RoleEntity } from './../role/entity/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    
  ],
  providers: [
    {
      provide: HashingService, 
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD, //По умолчанию закрыть доступ для всех страниц
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PremissionGuard   
    },
    AccessTokenGuard,
    AuthenticationService,
    RefreshTokenIdsStorage,
  ],
  controllers: [AuthenticationController]
})
export class AuthModule { }
