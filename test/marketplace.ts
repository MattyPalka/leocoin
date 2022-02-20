import { BigNumber } from "ethers";
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

  
  beforeEach(async () => {
    const UsdtToken = await ethers.getContractFactory("FakeUSDT") as FakeUSDT__factory;
    usdtToken = await UsdtToken.deploy();
    
    await usdtToken.deployed();

    const LeoToken = await ethers.getContractFactory("LeoToken");
    leoToken = await LeoToken.deploy();
    
    await leoToken.deployed();

    const Marketplace = await ethers.getContractFactory("Marketplace") as Marketplace__factory;
    marketplace = await Marketplace.deploy(leoToken.address, usdtToken.address)

    await marketplace.deployed()

    await leoToken.approve(marketplace.address, await leoToken.totalSupply())
  });

  describe("xxx", () => {
    it ("should leo", async () => {
      await marketplace.exchange(BigNumber.from(3).mul( BigNumber.from(10).pow(6)), purchaseDirection.LEO);
    })

  })
})