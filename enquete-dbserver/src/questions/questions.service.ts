import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';

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
  findOneByFormId(formId: number): Promise<Question[]> {
    return this.questionsRepository.find({ where: { form: {form_id:formId} } });
  }

  create(@Body() createQuestionDto:CreateQuestionDto): Promise<Question> {
    return this.questionsRepository.save(createQuestionDto);
  }
  
  async remove(id: number): Promise<void> {
    await this.questionsRepository.delete(id);
  }
}
