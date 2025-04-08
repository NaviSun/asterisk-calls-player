import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export class SignInDto {
    @ApiProperty({
        example: 'test@mail.com',
        description: 'email'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password',
        description: 'Пароль пользователя'
    })
    @MinLength(8)
    password: string;
}
