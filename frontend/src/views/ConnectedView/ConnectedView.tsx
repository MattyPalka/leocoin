import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { TokenData } from "../../types/TokenData"

interface Props {
  tokenData: TokenData,
  refresh: VoidFunction;
  setTokenData: React.Dispatch<React.SetStateAction<TokenData | undefined>>
}

export const ConnectedView = ({tokenData, refresh, setTokenData } : Props) => {
  const { token, signerAddress, isOwnerConnected } = tokenData;
  const [leoValue, setLeoValue] = useState("0")
  const [ethValue, setEthValue] = useState("0")
  const [contractEthBalance, setContractEthBalance] = useState("0")

  const buy = async () => {
    const tx = await token?.buy({value: ethers.utils.parseEther(ethValue)})
    await tx.wait();
    refresh()
  }

  const withdrawLEO = async () => {

    const tx = await token?.withdrawLeo(handleLeoAmount());
    await tx.wait();
    
    refresh();
  }

  const withdrawETH = async () => {
    await token?.paymeup();
  }

  const handleLeoAmount = () => {
    const splitValue = leoValue.split(".")
    const actualDecimals = `${splitValue[1]||""}${"0".repeat(18-(splitValue[1] ? splitValue[1].length:0))}`
    return BigNumber.from(`${splitValue[0]}${actualDecimals}`) 
  }

  const checkCurrentETHAmount = useCallback (async () => {
    const ethBalance = await token?.provider.getBalance(token.address) || 0;
    setContractEthBalance(ethers.utils.formatEther(ethBalance))
  },[token?.address, token?.provider])

  useEffect(()=>{
    isOwnerConnected && checkCurrentETHAmount();
  },[isOwnerConnected, checkCurrentETHAmount])

  return (
    <>
      <div>{tokenData.signerAddress}</div>
      <div>{tokenData.tokenBalance} {tokenData?.tokenSymbol}</div>
      <div>
        {isOwnerConnected ? (
          <>
            <div>
              <input value={leoValue} onChange={e=>{
                if (!/^(\d)*\.?\d{0,18}$/.test(e.target.value)){
                  return
                }
                
                setLeoValue(e.target.value)}}
              />

              <button onClick={withdrawLEO}>Withdraw Leo</button>
            </div>
            <div>
              <button onClick={withdrawETH}>Withdraw ETH</button>
            </div>
            <div>
              <div>ETH BALANCE: {contractEthBalance}</div>
              <button onClick={checkCurrentETHAmount}>Refresh Contract ETH Balance</button>
            </div>
          </>
        ) : (
        <>
        <div>1ETH = 100LE0
        </div>
        <label>ETH Value to spend</label>
        <input value={ethValue} onChange={(e)=>{
          if (!/^(\d)*\.?\d{0,18}$/.test(e.target.value)){
            return
          }
          
          setEthValue(e.target.value)
        }}
        />
          <button onClick={buy}>
            Buy LEO
          </button>
        </>
        )}    
      </div>
    </>
  )
}