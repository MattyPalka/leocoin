
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { ContractData } from "types/tokens";
import { makeContext } from "./ContextCreator";
import TokenArtifacts from 'contracts/LeoToken.json'
import contractAddress from 'contracts/contract-addresses.json'

export const [useContractContext, ContractProvider] = makeContext(()=>{

  const [connected, setConnected] = useState(false)
  const [leoTokenData, setLeoTokenData] = useState<ContractData>()
  const [ownerEthBalance, setOwnerEthBalance] = useState('')


  let leoToken: ethers.Contract | undefined, 
      signer: ethers.providers.JsonRpcSigner | undefined;
  
  if (leoTokenData){
    leoToken = leoTokenData.leoToken;
    signer = leoTokenData.signer;
  }
  

  const connect = useCallback (async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    console.log('NetworkId: ', chainId);
    setConnected(true);
  
    const leoToken = new ethers.Contract(contractAddress.LeoToken, TokenArtifacts.abi, signer);
    setLeoTokenData(prevState => ({
      ...prevState,
      leoToken,
      signer,
      signerAddress
    }))

  },[])

  const refresh = useCallback( async () => {
     
    if (!leoToken || !signer){
      return;
    }

    const tokens = await leoToken.balanceOf(signer.getAddress());

    const tokenBalanceReadable = ethers.utils.formatUnits(tokens, 18);
    const leoTokenName = await leoToken.name();
    const leoTokenSymbol = await leoToken.symbol();
    const isOwnerConnected = await leoToken.isOwner();

    if (isOwnerConnected){
      const ethBalance = await leoToken.provider.getBalance(leoToken.address)
      setOwnerEthBalance(ethers.utils.formatEther(ethBalance))
    }

    setLeoTokenData(prevState => ({
      ...prevState,
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
        setLeoTokenData(undefined);
        return
      } 
      connect()
    }
    window.ethereum.on("accountsChanged", handleAccountChange)
    return () => { window.ethereum.removeListener( "accountsChanged", handleAccountChange )}
  },[connect])
  
  return {leoTokenData, setLeoTokenData, connect, connected, refresh, ownerEthBalance}
});

