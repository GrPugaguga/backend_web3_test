import { Controller, Get, Param } from '@nestjs/common';
import { CosmosService } from './cosmos.service';
import { GetCosmosBlockDto } from './dto/get-block.dto';
import { GetCosmosTxDto } from './dto/get-tx.dto';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('cosmos')
@Controller('cosmos')
export class CosmosController {
  constructor(private readonly svc: CosmosService) {}

  @Get('block/:height')
  @ApiOperation({ summary: 'Get Cosmos block by height' })
  @ApiParam({ name: 'height', type: Number, description: 'Block height (>= 1)' })
  @ApiOkResponse({ description: 'Block data for the given height' })
  getBlock(@Param() p: GetCosmosBlockDto) {
    return this.svc.getBlockByHeight(p.height);
  }

  @Get('transactions/:hash')
  @ApiOperation({ summary: 'Get Cosmos transaction by hash' })
  @ApiParam({ name: 'hash', type: String, description: 'Hex tx hash (64 chars, no 0x)' })
  @ApiOkResponse({ description: 'Transaction data for the given hash' })
  getTx(@Param() p: GetCosmosTxDto) {
    return this.svc.getTxByHash(p.hash.toUpperCase()); 
  }
}
