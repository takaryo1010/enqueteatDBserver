import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto { 
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    user_email: string;

    
}
