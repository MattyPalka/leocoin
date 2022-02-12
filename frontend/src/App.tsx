import { useEffect } from "react";
import { ConnectedView } from "./views/ConnectedView";
import { useTokenContext } from './contexts/TokenContext';

function App() {
  const {tokenData, connect, connected, refresh } = useTokenContext()

  useEffect(()=>{
    refresh()
  },[refresh])

  if (window.ethereum === undefined) {
    return <div> No wallet detected on the browser</div>
  }

  if (connected && tokenData) {
    return <ConnectedView />
  }

  return (
    <div >
      <button onClick={connect}>Connect wallet</button>
    </div>
  );
}

export default App;
