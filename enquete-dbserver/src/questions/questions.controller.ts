import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  findAll(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @Post()
  create(@Body() question: Question): Promise<Question> {
    return this.questionsService.create(question);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.questionsService.remove(id);
  }
}
