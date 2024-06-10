import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Question } from '../entities/question.entity';
export class CreateQuestionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    question_text: string;
    

}
