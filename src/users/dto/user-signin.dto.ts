import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserSigninDto {
    @IsNotEmpty({ message: 'Email is required' })
        @IsString({ message: 'Email must be a string' })
        email: string;
        
        @IsNotEmpty({ message: 'Password is required' })
        @MinLength(6, { message: 'Password must be at least 6 characters long' })
        password: string;
}