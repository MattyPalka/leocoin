import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { FakeUSDT, Leon, LeoToken, Marketplace } from "../typechain";

describe("Marketplace", async () => {

  let usdtToken:  FakeUSDT;
  let leoToken: LeoToken;
  let marketplace: Marketplace;
  let nft: Leon;

  let buyer: SignerWithAddress;

  
  beforeEach(async () => {
    const UsdtToken = await ethers.getContractFactory("FakeUSDT");
    usdtToken = await UsdtToken.deploy();
    
    await usdtToken.deployed();

    const LeoToken = await ethers.getContractFactory("LeoToken");
    leoToken = await LeoToken.deploy();
    
    await leoToken.deployed();

    const NFT = await ethers.getContractFactory("Leon");
    nft = await NFT.deploy();
    
    await nft.deployed();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(leoToken.address, usdtToken.address, nft.address);

    await marketplace.deployed();

    [buyer] = await ethers.getSigners();

    await usdtToken.giveTokens(buyer.address, ethers.utils.parseUnits("100000", 6));
    await usdtToken.giveTokens(marketplace.address, ethers.utils.parseUnits("100000", 6));
    await leoToken.transferFrom(leoToken.address, marketplace.address, ethers.utils.parseUnits("50000", 18));
    await leoToken.transferFrom(leoToken.address, buyer.address, ethers.utils.parseUnits("50000", 18));

    await nft.safeTransferFrom(buyer.address, marketplace.address, "0", 1, []);
    await nft.safeTransferFrom(buyer.address, marketplace.address, "1", 1, []);
    await nft.safeTransferFrom(buyer.address, marketplace.address, "2", 1, []);
  });

  describe("Transactions", () => {
    it ("Should exchange LEO to USDT", async () => {
      // 400 LEO -> 12 USDT
      const currentBalance = await usdtToken.balanceOf(buyer.address);
      await leoToken.approve(marketplace.address, ethers.utils.parseUnits("400", 18));
      await marketplace.exchange(leoToken.address, usdtToken.address, ethers.utils.parseUnits("400", 18));
      const newBalance = await usdtToken.balanceOf(buyer.address);

      expect(newBalance.sub(currentBalance)).to.equal(ethers.utils.parseUnits('12', 6));
    })

    it ("Should exchange USDT to LEO", async () => {
      // 9 USDT -> 300 LEO
      const currentBalance = await leoToken.balanceOf(buyer.address);
      await usdtToken.approve(marketplace.address, ethers.utils.parseUnits("9", 6));
      await marketplace.exchange(usdtToken.address, leoToken.address, ethers.utils.parseUnits("9", 6));
      const newBalance = await leoToken.balanceOf(buyer.address);

      expect(newBalance.sub(currentBalance)).to.equal(ethers.utils.parseUnits('300', 18));
    })

    it ("Should buy NFT with LEO", async () => {
      await leoToken.approve(marketplace.address, ethers.utils.parseUnits("200", 18));
      await marketplace.buyNFT("1", leoToken.address);

      expect(await nft.balanceOf(buyer.address, "1")).to.equal(1);
    })

    it ("Should buy NFT with USDT", async () => {
      await usdtToken.approve(marketplace.address, ethers.utils.parseUnits("1.5", 6));
      await marketplace.buyNFT("1", usdtToken.address);

      expect(await nft.balanceOf(buyer.address, "1")).to.equal(1);
    })

    it ("Should sell NFT for LEO", async () => {
      await usdtToken.approve(marketplace.address, ethers.utils.parseUnits("1.5", 6));
      await marketplace.buyNFT("0", usdtToken.address);

      const beforeBalance = await leoToken.balanceOf(buyer.address);
      await nft.setApprovalForAll(marketplace.address, true);
      await marketplace.sellNFT("0", leoToken.address);
      await nft.setApprovalForAll(marketplace.address, false);
      const afterBalance = await leoToken.balanceOf(buyer.address);
      expect(afterBalance.sub(beforeBalance)).to.equal(ethers.utils.parseUnits('200', 18));
    })

    it ("Should  sell NFT for USDT", async () => {
      await leoToken.approve(marketplace.address, ethers.utils.parseUnits("200", 18));
      await marketplace.buyNFT("0", leoToken.address);

      const beforeBalance = await usdtToken.balanceOf(buyer.address);
      await nft.setApprovalForAll(marketplace.address, true);
      await marketplace.sellNFT("0", usdtToken.address);
      await nft.setApprovalForAll(marketplace.address, false);
      const afterBalance = await usdtToken.balanceOf(buyer.address);
      expect(afterBalance.sub(beforeBalance)).to.equal(ethers.utils.parseUnits('1.5', 6));
    })

  })
})