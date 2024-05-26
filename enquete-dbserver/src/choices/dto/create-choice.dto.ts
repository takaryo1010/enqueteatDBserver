import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateChoiceDto {
    @ApiProperty({ example: 'Choice 1' })
    @IsNotEmpty()
    @IsString()
    choice_text: string;

    @ApiProperty({ example: 0 })
    @IsNotEmpty()
    @IsNumber()
    vote_count: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    question_id: number;
}
