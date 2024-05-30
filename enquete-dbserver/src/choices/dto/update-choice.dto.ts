import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber,IsString } from 'class-validator';

export class UpdateChoiceDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  choice_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  choice_text: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    vote_counter: number;
}
