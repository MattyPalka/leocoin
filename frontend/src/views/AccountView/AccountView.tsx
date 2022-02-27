import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { useContractContext } from 'contexts/ContractContext';
import { ContractData } from 'types/tokens';
import { ConnectedView as Styled } from "./styled";
import { ListedText } from "components/ListedText";
import { InputWithButton } from "components/InputWithButton";
import { setToast } from "utils/setToast";


export const AccountView = () => {
  const { leoTokenData, refresh, ownerEthBalance} = useContractContext()
  const { leoToken, signerAddress, isOwnerConnected, leoTokenBalance, leoTokenSymbol } = leoTokenData as ContractData;
  const [leoValue, setLeoValue] = useState("0")
  const [ethValue, setEthValue] = useState("0")

  const buy = async () => {
    try{
      const tx = await leoToken?.buy({value: ethers.utils.parseEther(ethValue)})
      await tx.wait();
      refresh()
    } catch (e: any) {
      setToast(e.data.message)
    }
  }

  const withdrawLEO = async () => {
    try {
      const tx = await leoToken?.withdrawLeo(handleAmount(leoValue));
      await tx.wait();
      
      refresh();
    } catch (e: any){
      setToast(e.data.message)
    }
  }

  const withdrawETH = async () => {
    try {
      await leoToken?.paymeup();
    } catch (e: any){
      setToast(e.data.message)
    }
  }

  const handleAmount = (value: string) => {
    const splitValue = value.split(".")
    const actualDecimals = `${splitValue[1]||""}${"0".repeat(18-(splitValue[1] ? splitValue[1].length:0))}`
    return BigNumber.from(`${splitValue[0]}${actualDecimals}`) 
  }

  return (
    <Styled.ViewWrapper>
      <Styled.Welcome>
      <h2>LEOCODE TOKEN</h2>
      <p>Welcome {isOwnerConnected ? 'owner' : 'investor'}</p>
      </Styled.Welcome>
      <Styled.Data>
      <ListedText label='Your wallet address:' text={signerAddress} />
      <ListedText label="Current balance:" text={`${leoTokenBalance} ${leoTokenSymbol}`} />

      <div>
        {isOwnerConnected ? (
          <>
            <ListedText label='As a token owner you can withdraw as many LEO as you want' />
            <InputWithButton 
              inputValue={leoValue} 
              inputOnChange={(e) => {
                if (!/^(\d)*\.?\d{0,18}$/.test(e.target.value)){
                  return
                }
                setLeoValue(e.target.value)}
              }
              buttonText='Withdraw Leo'
              onButtonClick={withdrawLEO}
            />
            <hr />
            <h2>Need some Ethereum?</h2>
            <ListedText label='Current Contract Balance:' text={`${ownerEthBalance} ETH`} />
            <Styled.ETHButtons>
              <Styled.Button onClick={withdrawETH} $type='success'>Withdraw ETH</Styled.Button>
              <Styled.Button onClick={refresh} >Refresh Contract ETH Balance</Styled.Button>
            </Styled.ETHButtons>
          </>
        ) : (
        <>
          <h2>Want to buy some LEOs?</h2>
          <ListedText 
            label={`You will pay ${ethValue} ETH`}
            text="for this much LEO"
          />
          <InputWithButton 
            inputValue={leoValue}
            inputOnChange={(e)=>{
              if (!/^(\d)*\.?\d{0,18}$/.test(e.target.value)){
                return
              }
              setLeoValue(e.target.value)
              setEthValue(ethers.utils.formatEther(handleAmount(e.target.value).div(100) || "0"))
            }}
            onButtonClick={buy}
            buttonText='Buy LEO'
          />
        </>
        )}    
      </div>
      </Styled.Data>
    </Styled.ViewWrapper>
  )
}