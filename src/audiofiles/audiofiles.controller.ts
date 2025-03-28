import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { FindBeetweenDateModel } from './dto/findBeetwenDate.dto';

@Controller('audiofiles')
export class AudiofilesController {

    constructor(private audioService: AudioFilesService) {
        
    }
    @Get('file')
    async getAudioInfo() {
        return this.audioService.getAll(0)
    }

    @Get('file/:page')
    async getAudioInfoPage(@Param('page') page: number) {
        return this.audioService.getAll(page)
    }
    @Get('/file/date/:date')
    async getAudioInfoFromDate(@Param( 'date') date: string){
        return this.audioService.getFromDate(date)
    }

    @Post('file')
    async getBeetwenDate(@Body() dateRange: FindBeetweenDateModel) {
        return this.audioService.getBetweenDates(dateRange.startDate, dateRange.endDate)
    }
}
