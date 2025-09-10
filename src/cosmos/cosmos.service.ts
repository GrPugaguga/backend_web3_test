import axios from 'axios';
import { fromBase64 } from "@cosmjs/encoding";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

@Injectable()
export class CosmosService {
  private baseUrl = process.env.COSMOS_TENDERMINT_REST!;

  private async restGet<T>(path: string, notFoundMessage: string): Promise<T> {
    if (!this.baseUrl) {
      throw new ServiceUnavailableException('COSMOS_TENDERMINT_REST is not configured');
    }
    try {
      const { data } = await axios.get(`${this.baseUrl}${path}`);
      return data as T;
    } catch (e: any) {
      if (e?.response?.status === 404) {
        throw new NotFoundException(notFoundMessage);
      }
      throw new InternalServerErrorException(e?.message || 'Cosmos REST request failed');
    }
  }

  async getBlockByHeight(height: number) {
    const data = await this.restGet<any>(
      `/cosmos/base/tendermint/v1beta1/blocks/${height}`,
      'Block not found',
    );

    const header = data?.block?.header;
    const hash = data?.block_id?.hash;
    if (!header || !hash || !header.height || !header.time) {
      throw new NotFoundException('Block not found');
    }

    return {
      height: Number(header.height),
      time: header.time,
      hash,
      proposedAddress: header.proposer_address ?? null,
    };
  }

  async getTxByHash(hash: string) {
    const data = await this.restGet<any>(
      `/cosmos/tx/v1beta1/txs/${hash}`,
      'Transaction not found',
    );

    const txr = data?.tx_response;
    if (!txr) throw new NotFoundException('Transaction not found');

    const tx = data?.tx;
    const gasUsed = txr.gas_used ?? null;
    const gasWanted = txr.gas_wanted ?? null;
    const time = txr.timestamp ?? null;
    const heightNum = txr.height ? Number(txr.height) : null;

    const feeCoins: Array<{ amount: string; denom: string }> | undefined = tx?.auth_info?.fee?.amount;
    const fee = Array.isArray(feeCoins) && feeCoins.length > 0
      ? feeCoins.map((c) => `${String(c.amount)}${String(c.denom)}`).join(', ')
      : 0;

    let sender: string | null = null;
    const evts = Array.isArray(txr.events) ? txr.events : [];
    const signerEvt = evts.find(e => e.type === 'signer');
    if (signerEvt && Array.isArray(signerEvt.attributes)) {
      try {
        for (const attr of signerEvt.attributes) {
          const kBytes = fromBase64(String(attr.key));
          const vBytes = fromBase64(String(attr.value));
          const key = Buffer.from(kBytes).toString('utf8');
          const value = Buffer.from(vBytes).toString('utf8');
          if (key === 'sei_addr') {
            sender = value;
            break;
          }
        }
      } catch {}
    }

    if (!txr.txhash) throw new NotFoundException('Transaction not found');

    return {
      hash: txr.txhash,
      height: heightNum,
      time,
      gasUsed,
      gasWanted,
      fee,
      sender,
    };
  }

}
