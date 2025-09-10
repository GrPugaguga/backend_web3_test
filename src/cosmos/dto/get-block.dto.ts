import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCosmosBlockDto {
  @ApiProperty({ description: 'Block height (>= 1)', example: 167246208, minimum: 1, type: Number })
  @IsInt() @Min(1)
  height!: number;
}
