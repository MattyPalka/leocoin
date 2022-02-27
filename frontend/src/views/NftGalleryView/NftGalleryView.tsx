import { useContractContext } from 'contexts/ContractContext';
import { ContractData } from 'types/tokens';
import contractAddress from 'contracts/contract-addresses.json';
import { Styled }from './styled'
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { NFT } from './components';

const TOTAL_NFTS = 3;

interface NftBalance {
  id: number;
  balance: number;
}

export const NftGalleryView = () => {
  const { contractData } = useContractContext()
  const {nft, signerAddress } = contractData as ContractData;
  const [userNfts, setUserNfts] = useState<NftBalance[]>([])
  const [marketplaceNfts, setMarketplaceNfts] = useState<NftBalance[]>([])

  const getMarketplaceNfts = async () => {
    const marketplaceNfts: NftBalance[] = []
    const userNfs: NftBalance[] = []
    
    for(let i = 0; i < TOTAL_NFTS; i++) {
      const nftsMarketplaceBalance = await nft?.balanceOf(contractAddress.Marketplace, i)
      const parsedBalance = parseInt(ethers.utils.formatUnits(nftsMarketplaceBalance, 0))
      if (!parsedBalance) {
        const nftsUserBalance = await nft?.balanceOf(signerAddress, i)
        const parsedBalance = parseInt(ethers.utils.formatUnits(nftsUserBalance, 0))
        userNfs.push(({id: i, balance: parsedBalance}))
      } else {
        marketplaceNfts.push(({id: i, balance: parsedBalance}))
      }
    }
    setMarketplaceNfts(marketplaceNfts)
    setUserNfts(userNfs)

  }
  
  useEffect(()=>{
    getMarketplaceNfts()
  },
  [])
  

  return (
    <Styled.Wrapper>
      <Styled.Header>
        <h2>NFTs on the Market</h2>
      </Styled.Header>
      <Styled.Content>
      {marketplaceNfts.filter(nft => !!nft.balance).map(nft => <NFT key={nft.id} id={nft.id} refresh={getMarketplaceNfts} />)}
      </Styled.Content>
      <Styled.Header>
        <h2>Your NFTs</h2>
      </Styled.Header>
      <Styled.Content>
        {userNfts.filter(nft => !!nft.balance).map(nft => <NFT key={nft.id} id={nft.id} refresh={getMarketplaceNfts} user/>)}
      </Styled.Content>
    </Styled.Wrapper>
  )
}