import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsDate, IsString } from 'class-validator';

 enum ROLES {
    'ADMIN',
    'USER'
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    avatar: string;

    @IsString()
    role: ROLES; 

    @IsBoolean()
    banned: boolean;

    @IsString()
    banReason: string;

    @IsDate()
    updatedAt: Date;
}
