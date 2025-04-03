import { Module } from '@nestjs/common';
import { FileWatcherService } from './file-watcher-service.service';
import { AudioFilesModule } from 'src/audiofiles/audiofiles.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [AudioFilesModule, ConfigModule],
    providers: [FileWatcherService],
    exports: [],
})
export class FileWatcherServiceModule {}
