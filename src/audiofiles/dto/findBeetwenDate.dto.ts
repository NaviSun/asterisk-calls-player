// find-between-date.dto.ts
import { IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindBetweenDateDto {
  @ApiProperty({
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-03-01'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date (YYYY-MM-DD)',
    example: '2025-03-31'
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Page number',
    required: false,
    example: 0
  })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    required: false,
    example: 10
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}