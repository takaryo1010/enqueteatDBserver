import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Form } from './entities/form.entity'


@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  findAll(): Promise<Form[]> {
    return this.formsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Form> {
    return this.formsService.findOne(id);
  }

  @Post()
  create(@Body() form: Form): Promise<Form> {
    return this.formsService.create(form);
  }


  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.formsService.remove(id);
  }
}
