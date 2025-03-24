import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FileWatcherServiceModule } from './file-watcher-service/file-watcher-service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioFileEntity } from './audiofiles/entities/files.entities';
import { AudioFilesModule } from './audiofiles/audiofiles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: [AudioFileEntity],
      synchronize: true,
    }),
    AudioFilesModule,
    FileWatcherServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
