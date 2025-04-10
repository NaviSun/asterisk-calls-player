import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class AddPermissionsToRoleDto {
    @ApiProperty({ example: '[1, 2]', description: 'Права на create_user, find_user' })
    @IsArray()
    @IsNotEmpty()
    permissionIds: number[]; // Массив ID разрешений
  }