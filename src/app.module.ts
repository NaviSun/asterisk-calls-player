import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileWatcherServiceModule } from './file-watcher-service/file-watcher-service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioFileEntity } from './audiofiles/entities/files.entities';
import { AudioFilesModule } from './audiofiles/audiofiles.module';
import { getDbConfig } from './config/typeorm.config';

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
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  
})


export class AppModule {}
