import axios from 'axios';
import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class EvmService {
  private rpc = process.env.EVM_RPC!;

  private async rpcCall(method: string, params: any[]) {
    if (!this.rpc) {
      throw new ServiceUnavailableException('EVM_RPC is not configured');
    }
    try {
      const { data } = await axios.post(this.rpc, {
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      });
      if (data.error) throw new Error(data.error.message);
      return data.result;
    } catch (e: any) {
      throw new InternalServerErrorException(e?.message || 'EVM RPC request failed');
    }
  }

  async getBlockByHeight(height: number) {
    const hexHeight = '0x' + height.toString(16);
    const b = await this.rpcCall('eth_getBlockByNumber', [hexHeight, false]);
    if (!b) throw new NotFoundException('Block not found');

    return {
      height: parseInt(b.number, 16),
      hash: b.hash,
      parentHash: b.parentHash,
      gasLimit: b.gasLimit ? BigInt(b.gasLimit).toString() : null,
      gasUsed: b.gasUsed ? BigInt(b.gasUsed).toString() : null,
      size: b.size ? parseInt(b.size, 16) : null,
    };
  }

  async getTxByHash(hash: string) {
    const tx = await this.rpcCall('eth_getTransactionByHash', [hash]);
    if (!tx) throw new NotFoundException('Transaction not found');

    return {
      hash: tx.hash,
      to: tx.to,
      from: tx.from,
      value: tx.value ? BigInt(tx.value).toString() : '0',
      input: tx.input,
      maxFeePerGas: tx.maxFeePerGas ? BigInt(tx.maxFeePerGas).toString() : null,
      maxPriotityFeePerGas: tx.maxPriorityFeePerGas ? BigInt(tx.maxPriorityFeePerGas).toString() : null,
      gasPrice: tx.gasPrice ? BigInt(tx.gasPrice).toString() : null,
    };
  }
}
