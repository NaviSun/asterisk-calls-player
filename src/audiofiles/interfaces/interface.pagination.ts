import { Type } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

// Интерфейс для пагинированного ответа
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  // DTO для пагинации
  export class PaginationDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    page?: number = 0;
  
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;
  }