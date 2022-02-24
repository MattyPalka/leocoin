import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { FakeUSDT, FakeUSDT__factory, LeoToken, Marketplace, Marketplace__factory } from "../typechain";

enum purchaseDirection {
  LEO,
  USDT
}


describe("Marketplace", async () => {

  let usdtToken:  FakeUSDT;
  let leoToken: LeoToken;
  let marketplace: Marketplace;
  let nft: Contract;

  let buyer: SignerWithAddress;

  
  beforeEach(async () => {
    const UsdtToken = await ethers.getContractFactory("FakeUSDT") as FakeUSDT__factory;
    usdtToken = await UsdtToken.deploy();
    
    await usdtToken.deployed();

    const LeoToken = await ethers.getContractFactory("LeoToken");
    leoToken = await LeoToken.deploy();
    
    await leoToken.deployed();

    const NFT = await ethers.getContractFactory("Leon");
    nft = await NFT.deploy();
    
    await leoToken.deployed();

    const Marketplace = await ethers.getContractFactory("Marketplace") as Marketplace__factory;
    marketplace = await Marketplace.deploy(leoToken.address, usdtToken.address, nft.address);

    await marketplace.deployed();

    [buyer] = await ethers.getSigners();

  });

  describe("xxx", () => {
    it ("should leo", async () => {
      
    })

  })
})