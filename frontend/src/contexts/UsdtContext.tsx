
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { UsdtToken } from "types/tokens";
import { makeContext } from "./ContextCreator";
import TokenArtifacts from 'contracts/UsdtToken.json'
import contractAddress from 'contracts/contract-addresses.json'

export const [useLeoTokenContext, LeoTokenProvider] = makeContext(()=>{

  const [connected, setConnected] = useState(false)
  const [usdtTokenData, setUsdtTokenData] = useState<UsdtToken>()


  let usdtToken: ethers.Contract | undefined, 
      signer: ethers.providers.JsonRpcSigner | undefined;
  
  if (usdtTokenData){
    usdtToken = usdtTokenData.usdtToken;
  }
  

  const connect = useCallback (async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    console.log('NetworkId: ', chainId);
    setConnected(true);
  
    const usdtToken = new ethers.Contract(contractAddress.USDTToken, TokenArtifacts.abi, signer);
    setUsdtTokenData(prevState => ({
      ...prevState,
      usdtToken,
      signer,
      signerAddress
    }))

  },[])

  const refresh = useCallback( async () => {
     
    if (!usdtToken || !signer){
      return;
    }


  },[usdtToken, signer])

  useEffect(()=>{
    const handleAccountChange = ([newAddress]: [string]) => {
      if (newAddress === undefined){
        setConnected(false);
        setUsdtTokenData(undefined);
        return
      } 
      connect()
    }
    window.ethereum.on("accountsChanged", handleAccountChange)
    return () => { window.ethereum.removeListener( "accountsChanged", handleAccountChange )}
  },[connect])
  
  return {usdtTokenData, setUsdtTokenData, connect, connected, refresh}
});

