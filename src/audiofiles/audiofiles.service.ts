import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AudioFileEntity } from "./entities/files.entities";
import { Repository } from "typeorm";
import { CreateAduioFileDto } from "./dto/create-audio.dto";

@Injectable()
export class AudioFilesService {
  constructor(
    @InjectRepository(AudioFileEntity)
    private readonly audioFileRepository: Repository<AudioFileEntity>
  ) {}

  async create(filePath: CreateAduioFileDto): Promise<AudioFileEntity> {
    return this.audioFileRepository.save(filePath);
  }

  async exist(filePath): Promise<AudioFileEntity | null> {
    const file = this.audioFileRepository.findOneBy({ filePath });
    return file;
  }

  async getAll() {
    return this.audioFileRepository.find()
  }
}
