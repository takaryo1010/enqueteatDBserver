import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTextAnswerDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
