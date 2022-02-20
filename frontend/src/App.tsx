import { useEffect } from "react";
import { ConnectedView } from "./views/ConnectedView";
import { useLeoTokenContext } from './contexts/LeoTokenContext';
import { ConnectWalletView, ContentWrapper } from "styled";

function App() {
  const {tokenData, connect, connected, refresh } = useLeoTokenContext()

  useEffect(()=>{
    refresh()
  },[refresh])

  return (
    <ContentWrapper>
      {window.ethereum === undefined && (
      <ConnectWalletView>
        <h3>No wallet detected</h3>
        <p>Please install some wallet first, MetaMask is suggested, and you can download it from</p>
        <a href="https://metamask.io" target="_blank" rel="noreferrer">metamusk.io</a>
      </ConnectWalletView>
      )}
      {connected && tokenData ? 
        (
          <ConnectedView />
        ) : 
        (
          <ConnectWalletView>
            <h2>LEOCODE TOKEN</h2>
            <button onClick={connect}>Connect Wallet</button>
          </ConnectWalletView>
        )
      }
    </ContentWrapper>
  )
}

export default App;
