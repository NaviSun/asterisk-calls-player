import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateRoleDto {
    @ApiProperty({ example: 'user', description: 'Имя Роли' })
    @IsString()
    role: string;
}

export class CreatePermissionDto {
    @ApiProperty({ example: 'create_permission', description: 'Имя разрешения' })
    @IsString()
    permission: string;
}