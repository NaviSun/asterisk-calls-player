import { Module } from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioFileEntity } from './entities/files.entities';
import { AudiofilesController } from './audiofiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AudioFileEntity])],
  providers: [AudioFilesService],
  exports: [AudioFilesService],
  controllers: [AudiofilesController],
})
export class AudioFilesModule {}
