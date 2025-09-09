import { IsInt, Min } from 'class-validator';

export class GetEvmBlockDto {
  @IsInt() @Min(0)
  height!: number;
}

