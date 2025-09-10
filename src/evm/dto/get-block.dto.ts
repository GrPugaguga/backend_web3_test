import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEvmBlockDto {
  @ApiProperty({ description: 'Block height (>= 0)', example: 167246208, minimum: 0, type: Number })
  @IsInt() @Min(0)
  height!: number;
}

