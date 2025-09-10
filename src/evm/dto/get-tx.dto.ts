import { IsHexadecimal, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEvmTxDto {
  @ApiProperty({ description: '0x-prefixed 32-byte tx hash', example: '0x8168c89093836314fde7a4c1e6fbd1322900d5bdbabffab2266976b5fcfda928', minLength: 66, maxLength: 66 })
  @IsHexadecimal() @Length(66, 66) // 0x + 64 hex
  hash!: string;
}
