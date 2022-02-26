
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { NFT } from "types/tokens";
import { makeContext } from "./ContextCreator";
import TokenArtifacts from 'contracts/UsdtToken.json'
import contractAddress from 'contracts/contract-addresses.json'

export const [useLeoTokenContext, LeoTokenProvider] = makeContext(()=>{

  const [connected, setConnected] = useState(false)
  const [nftData, setNftData] = useState<NFT>()


  let nft: ethers.Contract | undefined, 
      signer: ethers.providers.JsonRpcSigner | undefined;
  
  if (nftData){
    nft = nftData.nft;
  }
  

  const connect = useCallback (async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    console.log('NetworkId: ', chainId);
    setConnected(true);
  
    const nft = new ethers.Contract(contractAddress.USDTToken, TokenArtifacts.abi, signer);
    setNftData(prevState => ({
      ...prevState,
      nft,
      signer,
      signerAddress
    }))

  },[])

  const refresh = useCallback( async () => {
     
    if (!nft || !signer){
      return;
    }


  },[nft, signer])

  useEffect(()=>{
    const handleAccountChange = ([newAddress]: [string]) => {
      if (newAddress === undefined){
        setConnected(false);
        setNftData(undefined);
        return
      } 
      connect()
    }
    window.ethereum.on("accountsChanged", handleAccountChange)
    return () => { window.ethereum.removeListener( "accountsChanged", handleAccountChange )}
  },[connect])
  
  return {nftData, setNftData, connect, connected, refresh}
});

