import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  public async findAll() {
    return await this.userRepository.find();
  }

  public async findOne(email: string) {
    return await this.userRepository.findBy({ email });
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  public async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
