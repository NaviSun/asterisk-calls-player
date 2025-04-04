import { ApiProperty } from "@nestjs/swagger";

// Дополнительный DTO для документации ответа
export class UserResponse {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор пользователя' })
  id: number;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  firstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  lastName: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin', 'moderator'], description: 'Роль пользователя' })
  role: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Дата создания' })
  createdAt: Date;
}