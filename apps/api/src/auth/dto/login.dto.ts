import { IsString, IsEmail, IsDefined, IsNotEmpty, Matches } from "class-validator";

export class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}