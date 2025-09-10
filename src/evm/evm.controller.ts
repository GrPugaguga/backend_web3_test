import { Controller, Get } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { EvmService } from './evm.service';
import { GetEvmBlockDto } from './dto/get-block.dto';
import { GetEvmTxDto } from './dto/get-tx.dto';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('evm')
@Controller('evm')
export class EvmController {
  constructor(private readonly svc: EvmService) {}

  @Get('block/:height')
  @ApiOperation({ summary: 'Get EVM block by height' })
  @ApiParam({ name: 'height', type: Number, description: 'Block height (>= 0)' })
  @ApiOkResponse({ description: 'Block data for the given height' })
  getBlock(@Param() p: GetEvmBlockDto) {
    return this.svc.getBlockByHeight(p.height);
  }

  @Get('transactions/:hash')
  @ApiOperation({ summary: 'Get EVM transaction by hash' })
  @ApiParam({ name: 'hash', type: String, description: '0x-prefixed 32-byte tx hash' })
  @ApiOkResponse({ description: 'Transaction data for the given hash' })
  getTx(@Param() p: GetEvmTxDto) {
    return this.svc.getTxByHash(p.hash.toLowerCase());
  }
}
