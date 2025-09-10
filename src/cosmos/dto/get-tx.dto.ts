import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCosmosTxDto {
  // Cosmos tx hash is hex (no "0x"), 64 chars (sha256)
  @ApiProperty({
    description: 'Hex tx hash (64 chars, no 0x)',
    example: 'C24AFF401CC7F1DDD3BC3AD0334376D9396EA187CC852825150A971532C48431',
    minLength: 64,
    maxLength: 64,
  })
  @IsString() @Length(64, 64)
  hash!: string;
}

