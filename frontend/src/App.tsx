import { useState } from "react";
import {ethers} from "ethers";
import TokenArtifacts from './contracts/Token.json'
import contractAddress from './contracts/contract-addresses.json'

function App() {
  const [connected, setConnected] = useState(false)
  const [signerAddress, setSignerAddress] = useState<string | undefined>(undefined)

  const connect = async () => {
    if (connected) {
      console.log("already connected")
      return
    } 

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    setSignerAddress(await signer.getAddress())
    setConnected(true);
  }

  if (window.ethereum === undefined) {
    return <div> No wallet detected on the browser</div>
  }
  return (
    <div >
      {connected ? (
        <div>{signerAddress}</div>
        ) : (
        <button onClick={connect}>Connect wallet</button>
        )}

    </div>
  );
}

export default App;
