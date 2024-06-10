import { PartialType } from '@nestjs/mapped-types';
import { CreateFormDto } from './create-form.dto';
import { IsString, IsNotEmpty } from 'class-validator';
export class UpdateFormDto extends PartialType(CreateFormDto) {
  @IsString()
  @IsNotEmpty()
  form_title: string;


}
