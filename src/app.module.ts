import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileWatcherServiceModule } from './file-watcher-service/file-watcher-service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioFilesModule } from './audiofiles/audiofiles.module';
import { getDbConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDbConfig,
      inject: [ConfigService],
    }
         
      
    ),
    AudioFilesModule,
    FileWatcherServiceModule,
    UsersModule,
    AuthModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  
})


export class AppModule {}
