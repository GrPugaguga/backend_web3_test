import { IsHexadecimal, Length } from 'class-validator';

export class GetEvmTxDto {
  @IsHexadecimal() @Length(66, 66) // 0x + 64 hex
  hash!: string;
}
