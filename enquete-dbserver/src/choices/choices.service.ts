import { Body, Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number): Promise<Choice | null> {
    const choice = await this.choicesRepository.findOne({
      where: { choice_id: id },
      relations: ['textAnswers'],
    });
    return choice || null;
  }

  create(@Body() createChoiceDto: CreateChoiceDto): Promise<Choice> {
    return this.choicesRepository.save(createChoiceDto);
  }

  async vote(id: number): Promise<Choice> {
    const updateChoiceDto: UpdateChoiceDto =
      await this.choicesRepository.findOneBy({ choice_id: id });
    if (!updateChoiceDto) {
      throw new Error('Choice not found');
    }

    updateChoiceDto.vote_counter++;
    const updatedChoice: Choice =
      await this.choicesRepository.save(updateChoiceDto);

    return updatedChoice;
  }

  async remove(id: number): Promise<void> {
    await this.choicesRepository.delete(id);
  }

  async update(id: number, updateChoiceDto: UpdateChoiceDto): Promise<Choice> {
    const choice = await this.choicesRepository.findOneBy({ choice_id: id });
    if (!choice) {
      throw new Error('Choice not found');
    }

    const updatedChoice = await this.choicesRepository.save({
      ...choice,
      ...updateChoiceDto,
    });

    return updatedChoice;
  }
}
