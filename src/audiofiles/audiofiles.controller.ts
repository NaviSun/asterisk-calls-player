import {
    Controller,
    Get,
    Post,
    Query,
    Body,
    UseFilters,
} from '@nestjs/common';
import { AudioFilesService } from './audiofiles.service';
import { FindBetweenDateDto } from './dto/findBeetwenDate.dto';
import { PaginationDto } from './interfaces/interface.pagination';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiQuery
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@ApiTags('Audio Files Management')
@Controller('audiofiles/file')
@UseFilters(new HttpExceptionFilter())
export class AudiofilesController {
    constructor(private readonly audioService: AudioFilesService) { }

    @Get()
    @ApiOperation({ summary: 'Get paginated list of all audio files' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of audio files'
    })
    async getAll(@Query() pagination: PaginationDto) {
        return this.audioService.getAll(pagination.page, pagination.limit);
    }

    @Post('by-date')
    @ApiOperation({ summary: 'Get audio files from specific date' })
    @ApiBody({
        schema: {
          type: 'object',
          required: ['date'], // Указываем обязательные поля как массив строк
          properties: {
            date: { 
              type: 'string', 
              format: 'date', 
              example: '2025-03-31',
              description: 'Date in YYYY-MM-DD format' 
            },
            page: { 
              type: 'number', 
              example: 0,
              default: 0,
              description: 'Page number (optional)' 
            },
            limit: { 
              type: 'number', 
              example: 10,
              default: 10,
              description: 'Items per page (optional)' 
            }
          }
        }
      })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of audio files from specified date'
    })
    async getFromDate(
        @Body('date') date: string,
        @Body('page') page = 0,
        @Body('limit') limit = 10,
    ) {
        return this.audioService.getFromDate(date, page, limit);
    }

    @Post('by-date-range')
    @ApiOperation({ summary: 'Get audio files between two dates' })
    @ApiBody({ type: FindBetweenDateDto })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of audio files in date range'
    })
    async getBetweenDates(
        @Body() { startDate, endDate, page = 0, limit = 10 }: FindBetweenDateDto
    ) {
        return this.audioService.getBetweenDates(
            startDate, // как string
            endDate,   // как string
            page,
            limit
        );
    }

    @Get('by-phone')
    @ApiOperation({ summary: 'Search audio files by phone number' })
    @ApiQuery({
        name: 'phoneNumber',
        required: true,
        type: String
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number
    })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of found audio files'
    })
    async searchByPhone(
        @Query('phoneNumber') phoneNumber: string,
        @Query() pagination: PaginationDto,
    ) {
        return this.audioService.findByPhoneNum(
            phoneNumber,
            pagination.page,
            pagination.limit
        );
    }
}