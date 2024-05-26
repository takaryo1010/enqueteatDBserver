import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateChoiceDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    choice_id: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    vote_count: number;
}
