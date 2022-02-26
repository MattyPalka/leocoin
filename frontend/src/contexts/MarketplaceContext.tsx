
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { MarketplaceData } from "types/tokens";
import { makeContext } from "./ContextCreator";
import TokenArtifacts from 'contracts/Marketplace.json'
import contractAddress from 'contracts/contract-addresses.json'

export const [useLeoTokenContext, LeoTokenProvider] = makeContext(()=>{

  const [connected, setConnected] = useState(false)
  const [marketplaceData, setMarketplaceData] = useState<MarketplaceData>()


  let marketplace: ethers.Contract | undefined, 
      signer: ethers.providers.JsonRpcSigner | undefined;
  
  if (marketplaceData){
    marketplace = marketplaceData.marketplace;
  }
  

  const connect = useCallback (async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    console.log('NetworkId: ', chainId);
    setConnected(true);
  
    const marketplace = new ethers.Contract(contractAddress.Marketplace, TokenArtifacts.abi, signer);
    setMarketplaceData(prevState => ({
      ...prevState,
      marketplace,
      signer,
      signerAddress
    }))

  },[])

  const refresh = useCallback( async () => {
     
    if (!marketplace || !signer){
      return;
    }


  },[marketplace, signer])

  useEffect(()=>{
    const handleAccountChange = ([newAddress]: [string]) => {
      if (newAddress === undefined){
        setConnected(false);
        setMarketplaceData(undefined);
        return
      } 
      connect()
    }
    window.ethereum.on("accountsChanged", handleAccountChange)
    return () => { window.ethereum.removeListener( "accountsChanged", handleAccountChange )}
  },[connect])
  
  return {marketplaceData, setMarketplaceData, connect, connected, refresh}
});

