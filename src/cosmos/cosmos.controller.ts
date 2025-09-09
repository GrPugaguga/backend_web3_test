import { Controller, Get, Param } from '@nestjs/common';
import { CosmosService } from './cosmos.service';
import { GetCosmosBlockDto } from './dto/get-block.dto';
import { GetCosmosTxDto } from './dto/get-tx.dto';

@Controller('cosmos')
export class CosmosController {
  constructor(private readonly svc: CosmosService) {}

  @Get('block/:height')
  getBlock(@Param() p: GetCosmosBlockDto) {
    return this.svc.getBlockByHeight(p.height);
  }

  @Get('transactions/:hash')
  getTx(@Param() p: GetCosmosTxDto) {
    return this.svc.getTxByHash(p.hash.toUpperCase()); // tendermint обычно верхним регистром
  }
}
