
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { TokenData } from "types/TokenData";
import { makeContext } from "./ContextCreator";
import TokenArtifacts from 'contracts/Token.json'
import contractAddress from 'contracts/contract-addresses.json'

export const [useTokenContext, TokenProvider] = makeContext(()=>{

  const [connected, setConnected] = useState(false)
  const [tokenData, setTokenData] = useState<TokenData>()
  const [ownerEthBalance, setOwnerEthBalance] = useState('')

  const connect = useCallback (async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    setConnected(true);
  
    const token = new ethers.Contract(contractAddress.Token, TokenArtifacts.abi, signer);
    setTokenData(prevState => ({
      ...prevState,
      token,
      signer,
      signerAddress
    }))

  },[])

  const refresh = useCallback( async () => {
     
    if (!tokenData?.token || !tokenData?.signer){
      return;
    }

    const { token, signer } = tokenData

    const tokens = await token.balanceOf(signer.getAddress());

    const tokenBalanceReadable = ethers.utils.formatUnits(tokens, 18);
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const isOwnerConnected = await token.isOwner();

    if (isOwnerConnected){
      const ethBalance = await token.provider.getBalance(token.address)
      setOwnerEthBalance(ethers.utils.formatEther(ethBalance))
    }

    setTokenData(prevState => ({
      ...prevState,
      tokenBalance: tokenBalanceReadable,
      tokenName,
      tokenSymbol,
      isOwnerConnected,
    }))

  },[tokenData?.token, tokenData?.signer])

  useEffect(()=>{
    const handleAccountChange = ([newAddress]: [string]) => {
      if (newAddress === undefined){
        setConnected(false);
        setTokenData(undefined);
        return
      } 
      connect()
    }
    window.ethereum.on("accountsChanged", handleAccountChange)
    return () => { window.ethereum.removeListener( "accountsChanged", handleAccountChange )}
  },[connect])
  
  return {tokenData, setTokenData, connect, connected, refresh, ownerEthBalance}
});

