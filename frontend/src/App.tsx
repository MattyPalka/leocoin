import { useCallback, useEffect } from "react";
import { AccountView } from "./views/AccountView";
import { useLeoTokenContext } from './contexts/LeoTokenContext';
import { ConnectWalletView, ContentWrapper } from "styled";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { NftGalleryView } from "views/NftGalleryView";
import { MarketplaceView } from "views/MarketplaceView";
import { NavBar } from "components/NavBar";
import { useMarketplaceContext } from "contexts/MarketplaceContext";
import { useUsdtContext } from "contexts/UsdtContext";
import { useNftContext } from "contexts/NftContext";

function App() {
  const {tokenData, connect: leoConnect, connected, refresh } = useLeoTokenContext()
  const {connect: marketplaceConnect, connected: marketplaceConnected, refresh: marketplaceRefresh} = useMarketplaceContext()
  const {connect: usdtConnect, connected: usdtConnected, refresh: usdtRefresh} = useUsdtContext();
  const {connect: nftConnect, connected: nftConnected, refresh: nftRefresh} = useNftContext();

  useEffect(()=>{
    marketplaceRefresh()
    usdtRefresh()
    nftRefresh()
    refresh()
  },[refresh, marketplaceRefresh, nftRefresh, usdtRefresh])



  const connect = useCallback(() => {
    leoConnect()
    marketplaceConnect()
    usdtConnect()
    nftConnect()
  }, [leoConnect, marketplaceConnect, usdtConnect, nftConnect])

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

  if (!connected || !marketplaceConnected || !nftConnected || !usdtConnected || !tokenData) {
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
