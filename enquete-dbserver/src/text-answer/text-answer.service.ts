import { Injectable } from '@nestjs/common';
import { CreateTextAnswerDto } from './dto/create-text-answer.dto';
import { UpdateTextAnswerDto } from './dto/update-text-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextAnswer } from './entities/text-answer.entity';
@Injectable()
export class TextAnswerService {
  constructor(
    @InjectRepository(TextAnswer)
    private textAnswerRepository: Repository<TextAnswer>,
  ) { }
  create(createTextAnswerDto: CreateTextAnswerDto) {
    return this.textAnswerRepository.save(createTextAnswerDto);
  }

  findAll() {
    return this.textAnswerRepository.find();
  }

  findOne(id: number) {
    return this.textAnswerRepository.findOneBy({ answer_id: id });
  }

  // update(id: number, updateTextAnswerDto: UpdateTextAnswerDto) {
  //   const textAnswer = this.textAnswerRepository.findOneBy({ answer_id: id });
  //   if (!textAnswer) {
  //     throw new Error('TextAnswer not found');
  //   }

  //   const updatedTextAnswer = this.textAnswerRepository.save({ ...textAnswer, ...updateTextAnswerDto });

  //   return updatedTextAnswer;
  // }

  // remove(id: number) {
  //   return this.textAnswerRepository.delete(id);
  // }
}
