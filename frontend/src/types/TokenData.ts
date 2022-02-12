import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "ethers";

export interface TokenData {
  signer?: JsonRpcSigner
  signerAddress?: string;
  token?: Contract;
  tokenBalance?: string;
  tokenName?: string;
  tokenSymbol?: string;
}