import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "ethers";

export interface LeoTokenData {
  signer?: JsonRpcSigner
  signerAddress?: string;
  token?: Contract;
  tokenBalance?: string;
  tokenName?: string;
  tokenSymbol?: string;
  isOwnerConnected?: boolean;
}

export interface MarketplaceData {
  marketplace: Contract;
}

export interface UsdtToken {
  usdtToken: Contract;
}

export interface NFT {
  nft: Contract;
}