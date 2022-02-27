import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "ethers";

export interface ContractData {
  signer?: JsonRpcSigner
  signerAddress?: string;
  leoToken?: Contract;
  marketplace?: Contract;
  usdtToken?: Contract;
  nft?: Contract;
  leoTokenBalance?: string;
  leoTokenName?: string;
  leoTokenSymbol?: string;
  isOwnerConnected?: boolean;
}