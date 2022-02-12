import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { useTokenContext } from 'contexts/TokenContext';
import { TokenData } from 'types/TokenData';


export const ConnectedView = () => {
  const { tokenData, refresh, ownerEthBalance} = useTokenContext()
  const { token, signerAddress, isOwnerConnected, tokenBalance, tokenSymbol } = tokenData as TokenData;
  const [leoValue, setLeoValue] = useState("0")
  const [ethValue, setEthValue] = useState("0")

  const buy = async () => {
    const tx = await token?.buy({value: ethers.utils.parseEther(ethValue)})
    await tx.wait();
    refresh()
  }

  const withdrawLEO = async () => {

    const tx = await token?.withdrawLeo(handleAmount(leoValue));
    await tx.wait();
    
    refresh();
  }

  const withdrawETH = async () => {
    await token?.paymeup();
  }

  const handleAmount = (value: string) => {
    const splitValue = value.split(".")
    const actualDecimals = `${splitValue[1]||""}${"0".repeat(18-(splitValue[1] ? splitValue[1].length:0))}`
    return BigNumber.from(`${splitValue[0]}${actualDecimals}`) 
  }


  return (
    <>
      <div>{signerAddress}</div>
      <div>{tokenBalance} {tokenSymbol}</div>
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
              <div>ETH BALANCE: {ownerEthBalance}</div>
              <button onClick={refresh}>Refresh Contract ETH Balance</button>
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
        <span>You will get: {ethers.utils.formatEther(handleAmount(ethValue).mul(100) || "0")} LEO</span>
          <button onClick={buy}>
            Buy LEO
          </button>
        </>
        )}    
      </div>
    </>
  )
}