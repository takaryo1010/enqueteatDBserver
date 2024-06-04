import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Form } from '../forms/entities/form.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(createUserDto);
  }

  async findOne(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ user_email: email });
  }

  async addForm(email: string, form_id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_email: email });
    const form = new Form();
    form.form_id = form_id;
    user.forms.push(form);
    return await this.usersRepository.save(user);
  }
}
