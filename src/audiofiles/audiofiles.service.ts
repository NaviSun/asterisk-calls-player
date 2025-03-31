import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioFileEntity } from './entities/files.entities';
import { PaginatedResponse } from './interfaces/interface.pagination';
import { CreateAduioFileDto } from './dto/create-audio.dto';

@Injectable()
export class AudioFilesService {
  constructor(
    @InjectRepository(AudioFileEntity)
    private readonly audioFileRepository: Repository<AudioFileEntity>,
  ) { }


  async create(filePath: CreateAduioFileDto): Promise<AudioFileEntity> {
    return this.audioFileRepository.save(filePath);
  }

  async exist(filePath): Promise<AudioFileEntity | null> {
    const file = this.audioFileRepository.findOneBy({ fileName: filePath });
    return file;
  }


  private async handlePagination<T>(
    queryBuilder: any,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<T>> {
    try {
      const [data, total] = await queryBuilder
        .skip(page * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('Pagination error');
    }
  }

  async getAll(page = 0, limit = 10): Promise<PaginatedResponse<AudioFileEntity>> {
    try {
      const queryBuilder = this.audioFileRepository
        .createQueryBuilder('file')
        .orderBy('file.createdAt', 'DESC');

      return this.handlePagination(queryBuilder, page, limit);
    } catch (error) {
      throw new NotFoundException('Could not retrieve audio files');
    }
  }

  async getFromDate(date: string, page = 0, limit = 10): Promise<PaginatedResponse<AudioFileEntity>> {
    try {
      const queryBuilder = this.audioFileRepository
        .createQueryBuilder('file')
        .where('DATE(file.createdAt) = DATE(:date)', { date })
        .orderBy('file.createdAt', 'DESC');

      return this.handlePagination(queryBuilder, page, limit);
    } catch (error) {
      throw new BadRequestException('Invalid date format');
    }
  }

  async getBetweenDates(
    startDate: string,
    endDate: string,   
    page = 0,
    limit = 10
  ): Promise<PaginatedResponse<AudioFileEntity>> {
    try {
      const queryBuilder = this.audioFileRepository
        .createQueryBuilder('file')
        .where('DATE(file.createdAt) BETWEEN DATE(:start) AND DATE(:end)', {
          start: startDate,
          end: endDate
        })
        .orderBy('file.createdAt', 'DESC');
      return this.handlePagination(queryBuilder, page, limit);
    } catch (error) {
      throw new BadRequestException('Invalid date range format. Use YYYY-MM-DD');
    }
  }

  async findByPhoneNum(
    phoneNumber: string,
    page = 0,
    limit = 10,
  ): Promise<PaginatedResponse<AudioFileEntity>> {
    try {
      if (!phoneNumber || phoneNumber.length < 3) {
        throw new BadRequestException('Phone number must be at least 3 characters');
      }

      const queryBuilder = this.audioFileRepository
        .createQueryBuilder('file')
        .where('file.OutColNumber LIKE :phone', { phone: `%${phoneNumber}%` })
        .orWhere('file.inColNumber LIKE :phone', { phone: `%${phoneNumber}%` })
        .orderBy('file.createdAt', 'DESC');

      return this.handlePagination(queryBuilder, page, limit);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Error searching by phone number');
    }
  }
}




