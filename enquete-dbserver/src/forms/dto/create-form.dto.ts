import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFormDto {
    @IsString()
    @IsNotEmpty()
    form_title: string;
    
    
 }
