import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }


  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }


  findOne(email: string) {
    return this.userRepository.findOneBy({email});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return '';
  }

}
