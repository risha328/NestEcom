import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserSigninDto } from "./user-signin.dto";

export class UserSignupDto extends UserSigninDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    // @IsNotEmpty({ message: 'Email is required' })
    // @IsString({ message: 'Email must be a string' })
    // email: string;

    // @IsNotEmpty({ message: 'Password is required' })
    // @MinLength(6, { message: 'Password must be at least 6 characters long' })
    // password: string;
}