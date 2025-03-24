import { Module } from '@nestjs/common';
import { FileWatcherService } from './file-watcher-service.service';
import { AudioFilesModule } from 'src/audiofiles/audiofiles.module';

@Module({
    imports: [AudioFilesModule],
    providers: [FileWatcherService],
    exports: [],
})
export class FileWatcherServiceModule {}
