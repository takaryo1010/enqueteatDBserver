import { Injectable } from '@nestjs/common';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Choice } from './entities/choice.entity';
@Injectable()
export class ChoicesService {
  constructor(
    @InjectRepository(Choice)
    private choicesRepository: Repository<Choice>,
  ) {}

  findAll(): Promise<Choice[]> {
    return this.choicesRepository.find({ relations: ['question'] });
  }

  findOne(id: number): Promise<Choice> {
    return this.choicesRepository.findOneBy({ choice_id: id });
  }

  create(choice: CreateChoiceDto): Promise<Choice> {
    return this.choicesRepository.save(choice);
  }
  async update(id: number, updateChoiceDto: UpdateChoiceDto): Promise<Choice> {
    const choice = await this.findOne(id);
    if (!choice) {
      throw new Error('Choice not found');
    }
    choice.vote_counter += 1;
    return this.choicesRepository.save(choice);
  }

  async remove(id: number): Promise<void> {
    await this.choicesRepository.delete(id);
  }
}
