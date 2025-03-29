/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import * as tokenJson from "./assets/MyToken.json";
import { Address, createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';


@Injectable()
export class AppService {
  
  
  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(): string {
    return process.env.TOKEN_ADDRESS as string;
  }

  async getTokenName(): Promise<string> {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
    });
    const name = await publicClient.readContract({
      address: this.getContractAddress() as Address,
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name as string;
  }

  getTransactionReceipt(hash: string) {
    throw new Error('Method not implemented.');
  }
  getTokenBalance(address: string) {
    throw new Error('Method not implemented.');
  }
  getTotalSupply() {
    throw new Error('Method not implemented.');
  }
}
