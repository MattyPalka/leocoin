import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { FakeUSDT, FakeUSDT__factory } from "../typechain";
const TOTAL_SUPPLY = 0;
const DECIMALS = 6;

describe("USDT", function () {
  let token:  FakeUSDT;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;
  let address2: SignerWithAddress;
  let address3: SignerWithAddress;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("FakeUSDT") as FakeUSDT__factory;
    token = await Token.deploy();
    [owner, address1, address2, address3] = await ethers.getSigners();
    await token.deployed();
  });

  describe("Deployment", () => {
    it("Should return token name", async () => {
      expect(await token.name()).to.equal("Fake USDT");
    });

    it("Should return token symbol", async () => {
      expect(await token.symbol()).to.equal("USDT");
    });

    it("Should return total supply", async () => {
      expect(await token.totalSupply()).to.equal(
        BigNumber.from(`${TOTAL_SUPPLY}`).mul(BigNumber.from(10).pow(DECIMALS))
      );
    });

    it("Should assign all tokens to the token addess", async () => {
      const tokenBalance = await token.balanceOf(token.address);
      expect(await token.totalSupply()).to.equal(tokenBalance);
    });

    it("Should not have any assets at owner address", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(0);
    });

    it("Should not have any assets at not owner address", async () => {
      const address1Balance = await token.balanceOf(address1.address);
      expect(address1Balance).to.equal(0);
    });

    it("Should allow to mint tokens and increase sender balance", async () => {
      const beforeBalance = await token.balanceOf(owner.address);
      await token.giveMeTokens(100);
      const afterAddress = await token.balanceOf(owner.address);

      expect(
        BigNumber.from(beforeBalance).add(BigNumber.from(100).mul(BigNumber.from(10).pow(DECIMALS)))
        ).to.equal(BigNumber.from(afterAddress));
    })
  });
});
