import { Controller, Get } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { EvmService } from './evm.service';
import { GetEvmBlockDto } from './dto/get-block.dto';
import { GetEvmTxDto } from './dto/get-tx.dto';

@Controller('evm')
export class EvmController {
  constructor(private readonly svc: EvmService) {}

  @Get('block/:height')
  getBlock(@Param() p: GetEvmBlockDto) {
    return this.svc.getBlockByHeight(p.height);
  }

  @Get('transactions/:hash')
  getTx(@Param() p: GetEvmTxDto) {
    return this.svc.getTxByHash(p.hash.toLowerCase());
  }
}
