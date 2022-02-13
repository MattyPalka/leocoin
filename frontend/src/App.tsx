import { useEffect } from "react";
import { ConnectedView } from "./views/ConnectedView";
import { useTokenContext } from './contexts/TokenContext';
import { ConnectWalletView, ContentWrapper } from "styled";

function App() {
  const {tokenData, connect, connected, refresh } = useTokenContext()

  useEffect(()=>{
    refresh()
  },[refresh])

  return (
    <ContentWrapper>
      {window.ethereum === undefined && (
      <ConnectWalletView>
        <h3>No wallet detected</h3>
        <p>Please install some wallet first, MetaMusk is suggested, and you can download it from</p>
        <a href="https://metamusk.io" target="_blank" rel="noreferrer">metamusk.io</a>
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
