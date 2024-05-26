import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  findAll(): Promise<Question[]> {
    return this.questionsRepository.find({ relations: ['choices'] });
  }

  findOne(id: number): Promise<Question> {
    return this.questionsRepository.findOneBy({ question_id: id });
  }

  create(question: Question): Promise<Question> {
    return this.questionsRepository.save(question);
  }

  async remove(id: number): Promise<void> {
    await this.questionsRepository.delete(id);
  }
}
