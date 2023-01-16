
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { ContractData } from "types/tokens";
import { makeContext } from "./ContextCreator";
import LeoTokenArtifacts from 'contracts/LeoToken.json'
import UsdtTokenArtifacts from 'contracts/UsdtToken.json';
import MarketplaceArtifacts from 'contracts/Marketplace.json'
import contractAddress from 'contracts/contract-addresses.json';
import NftArtifacts from 'contracts/LeonNft.json';


export const [useContractContext, ContractProvider] = makeContext(()=>{

  const [connected, setConnected] = useState(false)
  const [contractData, setContractData] = useState<ContractData>()
  const [ownerEthBalance, setOwnerEthBalance] = useState('')


  let leoToken: ethers.Contract | undefined, 
      usdtToken: ethers.Contract | undefined, 
      signer: ethers.providers.JsonRpcSigner | undefined;
  
  if (contractData){
    usdtToken = contractData.usdtToken;
    leoToken = contractData.leoToken;
    signer = contractData.signer;
  }
  

  const connect = useCallback (async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    console.log('NetworkId: ', chainId);
    setConnected(true);
  
    const leoToken = new ethers.Contract(contractAddress.LeoToken, LeoTokenArtifacts.abi, signer);
    const usdtToken = new ethers.Contract(contractAddress.USDTToken, UsdtTokenArtifacts.abi, signer);
    const marketplace = new ethers.Contract(contractAddress.Marketplace, MarketplaceArtifacts.abi, signer);
    const nft = new ethers.Contract(contractAddress.LeonNFT, NftArtifacts.abi, signer);

    setContractData(prevState => ({
      ...prevState,
      leoToken,
      marketplace,
      usdtToken,
      nft,
      signer,
      signerAddress
    }))

  },[])

  const refresh = useCallback( async () => {
     
    if (!leoToken || !signer || !usdtToken){
      return;
    }

    const tokens = await leoToken.balanceOf(signer.getAddress());
    const usdtBalance = await usdtToken.balanceOf(signer.getAddress());
    const tokenBalanceReadable = ethers.utils.formatUnits(tokens, 18);
    const leoTokenName = await leoToken.name();
    const leoTokenSymbol = await leoToken.symbol();
    const isOwnerConnected = await leoToken.isOwner();

    if (isOwnerConnected){
      const ethBalance = await leoToken.provider.getBalance(leoToken.address)
      setOwnerEthBalance(ethers.utils.formatEther(ethBalance))
    }

    setContractData(prevState => ({
      ...prevState,
      usdtTokenBalance: ethers.utils.formatUnits(usdtBalance, 6),
      leoTokenBalance: tokenBalanceReadable,
      leoTokenName,
      leoTokenSymbol,
      isOwnerConnected,
    }))

  },[leoToken, signer])

  useEffect(()=>{
    const handleAccountChange = ([newAddress]: [string]) => {
      if (newAddress === undefined){
        setConnected(false);
        setContractData(undefined);
        return
      } 
      connect()
    }
    window.ethereum.on("accountsChanged", handleAccountChange)
    return () => { window.ethereum.removeListener( "accountsChanged", handleAccountChange )}
  },[connect])
  
  return {contractData, setContractData, connect, connected, refresh, ownerEthBalance}
});

