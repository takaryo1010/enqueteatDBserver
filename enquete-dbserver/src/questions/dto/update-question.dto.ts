import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
    @IsNotEmpty()
    @IsString()
    question_text: string;
    
}
