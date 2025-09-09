import { IsString, Length } from 'class-validator';
export class GetCosmosTxDto {
  // В Cosmos хэш без "0x", длина 64 символа (sha256 hex)
  @IsString() @Length(64, 64)
  hash!: string;
}
