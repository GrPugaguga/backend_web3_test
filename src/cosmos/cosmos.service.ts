import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CosmosService {
  private tendermint = process.env.COSMOS_TENDERMINT_RPC!;
  private rest = process.env.COSMOS_GRPC_REST!;

  async getBlockByHeight(height: number) {
    try {
      const { data } = await axios.get(
        `${this.rest}/cosmos/base/tendermint/v1beta1/blocks/${height}`
      );

      const hdr = data.block.header;
      const hash = data.block_id?.hash || null;
      return {
        height: Number(hdr.height),
        time: hdr.time,          
        hash,
        proposedAddress: hdr.proposer_address, 
      };
    } catch {
      const { data } = await axios.get(`${this.tendermint}/block?height=${height}`);
      const hdr = data.result.block.header;
      const hash = data.result.block_id?.hash || null;
      return {
        height: Number(hdr.height),
        time: hdr.time,
        hash,
        proposedAddress: hdr.proposer_address,
      };
    }
  }


  async getTxByHash(hash: string) {
    try {
      const { data } = await axios.get(`${this.rest}/cosmos/tx/v1beta1/txs/${hash}`);
      const txr = data.tx_response;
      const tx = data.tx;

      const feeCoins = tx?.auth_info?.fee?.amount || [];
      const fee = feeCoins.map((c: any) => `${c.amount}${c.denom}`).join(',');

      let sender: string | null = null;
      const msgs = tx?.body?.messages || [];
      if (msgs.length) {
        const m0 = msgs[0];
        sender =
          m0.sender ||
          m0.from_address ||
          m0.signer ||
          null;
      }

      return {
        hash: txr.txhash,
        height: Number(txr.height),
        time: txr.timestamp,                
        gasUsed: Number(txr.gas_used),
        gasWanted: Number(txr.gas_wanted),
        fee,
        sender,
      };
    } catch {
      const tendermintHash = '0x' + hash.toUpperCase();
      const { data } = await axios.get(`${this.tendermint}/tx?hash=${tendermintHash}`);
      const r = data.result;
      return {
        hash,
        height: Number(r.height),
        time: null,
        gasUsed: Number(r.tx_result?.gas_used ?? 0),
        gasWanted: Number(r.tx_result?.gas_wanted ?? 0),
        fee: null,
        sender: null,
      };
    }
  }
}
