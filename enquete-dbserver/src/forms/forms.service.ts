import { Body, Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './entities/form.entity';
@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private formsRepository: Repository<Form>,
  ) {}

  findAll(): Promise<Form[]> {
    return this.formsRepository.find();
  }

  findOne(id: number): Promise<Form> {
    return this.formsRepository.findOneBy({ form_id: id });
  }

  
  create(@Body() createFormDto:CreateFormDto): Promise<Form> {
    return this.formsRepository.save(createFormDto);
  }

  async remove(id: number): Promise<void> {
    await this.formsRepository.delete(id);
  }
}
