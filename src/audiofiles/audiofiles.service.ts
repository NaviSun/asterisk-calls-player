import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AudioFileEntity } from "./entities/files.entities";
import { Raw, Repository } from "typeorm";
import { CreateAduioFileDto } from "./dto/create-audio.dto";

@Injectable()
export class AudioFilesService {
  constructor(
    @InjectRepository(AudioFileEntity)
    private readonly audioFileRepository: Repository<AudioFileEntity>
  ) { }

  async create(filePath: CreateAduioFileDto): Promise<AudioFileEntity> {
    return this.audioFileRepository.save(filePath);
  }

  async exist(filePath): Promise<AudioFileEntity | null> {
    const file = this.audioFileRepository.findOneBy({ fileName: filePath });
    return file;
  }

  async getAll(ofset: number) {
    return this.audioFileRepository.find({
      order: {
        createdAt: 'DESC',
      },
      skip: ofset,
      take: 10,
    })
  }

  async getFromDate(date) {
    return this.audioFileRepository.findBy({
      createdAt: Raw(alias => `DATE(${alias}) = DATE(:date)`, { date })    
    })
  }

  async getBetweenDates(startDate: Date, endDate: Date) {
    return this.audioFileRepository.findBy({
      createdAt: Raw(alias => `${alias} BETWEEN :startDate AND :endDate`, { 
        startDate, 
        endDate 
      })    
    });
  }

}
