import { useCallback, useEffect, useState } from "react";
import { ethers} from "ethers";
import TokenArtifacts from './contracts/Token.json'
import contractAddress from './contracts/contract-addresses.json'
import { TokenData } from "./types/TokenData";
import { ConnectedView } from "./views/ConnectedView";

function App() {
  const [connected, setConnected] = useState(false)
  const [tokenData, setTokenData] = useState<TokenData>()

  const connect = async () => {
    if (connected) {
      console.log("already connected")
      return
    } 

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    setConnected(true);
  
    const token = new ethers.Contract(contractAddress.Token, TokenArtifacts.abi, signer);
    setTokenData(prevState => ({
      token,
      signer,
      signerAddress,
      ...prevState
    }))
  }

  const refresh = useCallback( async () => {
     
    if (!tokenData?.token || !tokenData?.signer){
      return;
    }
    const { token, signer } = tokenData

    const tokens = await token.balanceOf(signer.getAddress());

    const tokenBalanceReadable = ethers.utils.formatUnits(tokens, 18);
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();

    setTokenData(prevState => ({
      tokenBalance: tokenBalanceReadable,
      tokenName,
      tokenSymbol,
      ...prevState
    }))
  
    
  },[tokenData?.token, tokenData?.signer])

  useEffect(()=>{
    refresh()
  },[refresh])

  if (window.ethereum === undefined) {
    return <div> No wallet detected on the browser</div>
  }

  if (connected && tokenData) {
    return <ConnectedView tokenData={tokenData} />
  }

  return (
    <div >
      <button onClick={connect}>Connect wallet</button>
    </div>
  );
}

export default App;
