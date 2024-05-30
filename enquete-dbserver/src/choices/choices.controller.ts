import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import { Choice } from './entities/choice.entity';
@Controller('choices')
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @Get()
  findAll(): Promise<Choice[]>{
    return this.choicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Choice> {
    return this.choicesService.findOne(id);
  }

  @Post()
  create(@Body() createChoiceDto: CreateChoiceDto): Promise<Choice>{
    return this.choicesService.create(createChoiceDto);
  }
  @Patch(':id/vote')
  vote(@Param('id') id: number, @Body() updateChoiceDto: UpdateChoiceDto): Promise<Choice> {
    return this.choicesService.vote(id, updateChoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.choicesService.remove(id);
  }
}
