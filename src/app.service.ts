/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import * as tokenJson from "./assets/MyToken.json";
import { Address, createPublicClient, createWalletClient, formatEther, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';


@Injectable()
export class AppService {
  
  
  publicClient;
  walletClient;
  
  constructor() {
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
    });
    this.walletClient = createWalletClient({
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
      chain: sepolia,
      account: account,
    });
  }


  
  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(): string {
    return process.env.TOKEN_ADDRESS as string;
  }

  async getTokenName(): Promise<string> {
    const name = await this.publicClient.readContract({
      address: this.getContractAddress() as Address,
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name as string;
  }

  async getTotalSupply() {
    const totalSupplyBN = await this.publicClient.readContract({
      address: this.getContractAddress() as Address,
      abi: tokenJson.abi,
      functionName: 'totalSupply',
    });
    const totalSupply = formatEther(totalSupplyBN as bigint);
    return totalSupply;
  }

  getTransactionReceipt(hash: string) {
    const receipt = this.publicClient.getTransactionReceipt({
      hash:hash as Address,
    });
    return receipt;
  }

  async getTokenBalance(address: string) {
    const balance = await this.publicClient.readContract({
      address: this.getContractAddress() as Address,
      abi: tokenJson.abi,
      functionName: 'balanceOf',
      args: [address as Address],
  });
  return balance;
  }

  getServerWalletAddress(): string {
    return this.walletClient.account.address;
  }

  async checkMinterRole(address: string): Promise<boolean> {
    const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    // const MINTER_ROLE =  await this.publicClient.readContract({
    //   address: this.getContractAddress(),
    //   abi: tokenJson.abi,
    //   functionName: 'MINTER_ROLE'
    // });
    const hasRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'hasRole',
      args: [MINTER_ROLE, address],
    });
    return hasRole;
  }

  mintTokens(address: any) {
    //to do: implement minttokens
    return {
      success: true,
      message: `Tokens minted succesfully`,
      address: address,
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    };
  }

}