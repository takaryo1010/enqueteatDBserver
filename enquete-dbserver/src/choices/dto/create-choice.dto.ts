import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Choice } from '../entities/choice.entity';

export class CreateChoiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  choice_text: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  choice_id: number;
}
