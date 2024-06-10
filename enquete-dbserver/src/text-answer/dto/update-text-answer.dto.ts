import { PartialType } from '@nestjs/mapped-types';
import { CreateTextAnswerDto } from './create-text-answer.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTextAnswerDto extends PartialType(CreateTextAnswerDto) {
    @IsNotEmpty()
    @IsString()
    text: string;
}
