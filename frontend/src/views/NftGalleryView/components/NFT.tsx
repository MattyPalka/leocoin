import { useContractContext } from "contexts/ContractContext";
import { useEffect, useState } from "react";
import { ContractData } from "types/tokens";
import contractAddress from 'contracts/contract-addresses.json';
import { Styled } from "./styled"
import { setToast } from "utils/setToast";
import { ethers } from "ethers";

interface Props {
  id: number;
  user?: boolean;
  refresh: VoidFunction;
}

interface Meta {
  name: string;
  image: string;
  description: string;
  atrributes: any[];
}

export const NFT = ({id, user, refresh}: Props) => {
  const { contractData } = useContractContext()
  const {nft, leoToken, usdtToken, marketplace } = contractData as ContractData;
  const [nftMeta, setNftMeta] = useState<Meta>()

  const getNftMetadata = async () => {
    const metaUrl = await nft?.uri(id);
    const response = await fetch(metaUrl.replace('{id}', id))
    const json = await response.json()
    setNftMeta(json)
  }

  useEffect(()=> {
    getNftMetadata()
  }, [])

  const buyWithLeo = async () => {
    try{
      await leoToken?.approve(contractAddress.Marketplace, ethers.utils.parseUnits("200", 18));
      const tx = await marketplace?.buyNFT(`${id}`, contractAddress.LeoToken)
      await tx.wait()
      refresh()
    } catch (e: any) {
      setToast(e.data.message);
    }
  }

  const sellForLeo = async () => {
    try{
      await nft?.setApprovalForAll(contractAddress.Marketplace, true);
      const tx = await marketplace?.sellNFT(`${id}`, contractAddress.LeoToken)
      await tx.wait()
      await nft?.setApprovalForAll(contractAddress.Marketplace, false);
      refresh()
    } catch (e: any) {
      setToast(e.data.message);
    }
  }

  const buyWithUSDT = async () => {
    try{
      await usdtToken?.approve(contractAddress.Marketplace, ethers.utils.parseUnits("1.7", 6));
      const tx = await marketplace?.buyNFT(`${id}`, contractAddress.USDTToken)
      await tx.wait()
      refresh()
    } catch (e: any) {
      setToast(e.data.message);
    }
  }

  const sellForUSDT = async () => {
    try {
      await nft?.setApprovalForAll(contractAddress.Marketplace, true);
      const tx = await marketplace?.sellNFT(`${id}`, contractAddress.USDTToken)
      await tx.wait()
      await nft?.setApprovalForAll(contractAddress.Marketplace, false);
      refresh()
    } catch (e: any) {
      setToast(e.data.message);
    }
  }
  
  if (!nftMeta) {
    <Styled.Wrapper>
      loading...
    </Styled.Wrapper>
  }

  return (
    <Styled.Wrapper>
      <Styled.Image src={nftMeta?.image} alt={nftMeta?.name}/>
      <Styled.Description>
        {nftMeta?.description}
      </Styled.Description>
      <Styled.Button onClick={user ? sellForLeo : buyWithLeo }>
      {user ? "Sell": "Buy"} 200 LEO
      </Styled.Button>
      <Styled.Button onClick={user ? sellForUSDT : buyWithUSDT}>
      {user ? "Sell": "Buy"} 1.5 USDT
      </Styled.Button>
    </Styled.Wrapper>
  )
}