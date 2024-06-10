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
  findByAdminister(administrator: string): Promise<Form[]> {
    return this.formsRepository.find({ where: { form_administrator: administrator } });
  }
  create(@Body() createFormDto: CreateFormDto): Promise<Form> {
    return this.formsRepository.save(createFormDto);
  }
  async update(id: number, updateFormDto: UpdateFormDto): Promise<Form> {

    const existingForm: Form = await this.formsRepository.findOneBy({
      form_id: id,
    });
    if (!existingForm) {
      throw new Error('Form not found');
    }
    existingForm.form_title = updateFormDto.form_title;
    return this.formsRepository.save(existingForm);
  }

  async remove(id: number): Promise<void> {
    await this.formsRepository.delete(id);
  }
}
