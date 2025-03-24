import { Controller, Get } from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';

@Controller('audiofiles')
export class AudiofilesController {

    constructor(private audioService: AudioFilesService) {
        
    }

    @Get('file')
    async getAudioInfo() {
        return this.audioService.getAll()
    }
}
