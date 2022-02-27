import { useEffect } from "react";
import { AccountView } from "./views/AccountView";
import { useContractContext } from './contexts/ContractContext';
import { ConnectWalletView, ContentWrapper } from "styled";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { NftGalleryView } from "views/NftGalleryView";
import { MarketplaceView } from "views/MarketplaceView";
import { NavBar } from "components/NavBar";

function App() {
  const {leoTokenData, connect, connected, refresh } = useContractContext()


  useEffect(()=>{

    refresh()
  },[refresh])


  useEffect(()=>{
    connect()
  }, [connect])


  if (window.ethereum === undefined) {
    return (
      <ContentWrapper>
        <ConnectWalletView>
          <h3>No wallet detected</h3>
          <p>Please install some wallet first, MetaMask is suggested, and you can download it from</p>
          <a href="https://metamask.io" target="_blank" rel="noreferrer">metamusk.io</a>
        </ConnectWalletView>
      </ContentWrapper>
    )
  }

  if (!connected || !leoTokenData) {
    return (
      <ContentWrapper>
        <ConnectWalletView>
              <h2>LEOCODE TOKEN</h2>
              <button onClick={connect}>Connect Wallet</button>
            </ConnectWalletView>
      </ContentWrapper>
    )
  }

  return (
    <BrowserRouter>
      <ContentWrapper>
        <NavBar />
      <Routes>
        <Route path='/' element={<MarketplaceView />} />
        <Route path='account' element={<AccountView />} />
        <Route path='gallery' element={<NftGalleryView />} />
      </Routes>
      </ContentWrapper>
    </BrowserRouter>
  )
}

export default App;
