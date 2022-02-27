import { ListedText } from 'components/ListedText'
import { useContractContext } from 'contexts/ContractContext'
import { BigNumber, ethers } from 'ethers'
import { useState } from 'react'
import { ContractData } from 'types/tokens'
import {Styled} from './styled'
import contractAddress from 'contracts/contract-addresses.json';

enum Direction {
  LEO,
  USDT
}


export const MarketplaceView = () => {
  const { contractData, refresh } = useContractContext()
  const { leoToken, usdtToken, marketplace, usdtTokenBalance, leoTokenBalance } = contractData as ContractData;
  const [usdtAmount, setUsdtAmount] = useState("0")
  const [leoAmount, setLeoAmount] = useState("0")

  const calculatePrice = (amount: string, direction: Direction) => {
    if (!amount.length){
      return
    }
    
    if (direction === Direction.LEO) {  
      const leo = BigNumber.from(ethers.utils.parseUnits(amount, 18))
      const usdtValue = leo.mul(3).div(BigNumber.from(10).pow(14));
      setUsdtAmount(ethers.utils.formatUnits(usdtValue, 6));
    } else {
      const usdt = BigNumber.from(ethers.utils.parseUnits(amount, 6))
      const leoValue = usdt.mul(BigNumber.from(10).pow(14)).div(3);
      setLeoAmount(ethers.utils.formatUnits(leoValue, 18))
    }
  }

  const exchange = async (direction: Direction) => {

    if (direction === Direction.LEO) {
      await usdtToken?.approve(contractAddress.Marketplace, ethers.utils.parseUnits(usdtAmount, 6))
    } else {
      await leoToken?.approve(contractAddress.Marketplace, ethers.utils.parseUnits(leoAmount, 18))
    }
    

    const tx = await marketplace?.exchange(
      direction === Direction.LEO ? contractAddress.USDTToken : contractAddress.LeoToken, 
      direction === Direction.LEO ? contractAddress.LeoToken : contractAddress.USDTToken, 
      direction === Direction.LEO ? ethers.utils.parseUnits(usdtAmount, 6) : ethers.utils.parseUnits(leoAmount, 18)
      )
    await tx.wait();
    refresh()
  }
  
  return (
    <Styled.Wrapper>
      <Styled.Welcome>
      <h2>EXCHANGE</h2>
      </Styled.Welcome>
      <Styled.Content>
      <Styled.Item>
        <ListedText 
          label={'LEO Value'}
          text={`Current Balance: ${leoTokenBalance} LEO`}
        />
        <Styled.Input 
          value={leoAmount} 
          onChange={(e)=>{
            if (!/^(\d)*\.?\d{0,18}$/.test(e.target.value)){
              return
            }
            setLeoAmount(e.target.value)
            calculatePrice(e.target.value, Direction.LEO)
          }}
        />
      </Styled.Item>
      <Styled.Item>
        <ListedText 
          label={'USDT Value'}
          text={`Current Balance: ${usdtTokenBalance} LEO`}
        />
        <Styled.Input 
          value={usdtAmount} 
          onChange={(e)=>{
            if (!/^(\d)*\.?\d{0,6}$/.test(e.target.value)){
              return
            }
            setUsdtAmount(e.target.value)
            calculatePrice(e.target.value, Direction.USDT)
          }}
        />
      </Styled.Item>
      <Styled.Item>
        <Styled.Button onClick={()=>{exchange(Direction.LEO)}}>
          Exchange USDT -&gt; LEO
        </Styled.Button>
        <Styled.Button onClick={()=>{exchange(Direction.USDT)}}>
          Exchange LEO -&gt; USDT
        </Styled.Button>
      </Styled.Item>
      </Styled.Content>
    </Styled.Wrapper>
  )
}