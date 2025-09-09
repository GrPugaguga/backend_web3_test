import { IsInt, Min } from 'class-validator';

export class GetCosmosBlockDto {
  @IsInt() @Min(1)
  height!: number;
}
