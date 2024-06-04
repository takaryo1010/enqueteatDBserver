import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Form } from 'src/forms/entities/form.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    user_email: string;

    
    forms: Form[];
}
