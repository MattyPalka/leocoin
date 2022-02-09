import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Token } from "../typechain";

const TOTAL_SUPPLY = 100_000;
const DECIMALS = 18;

describe("Token", function () {
  let token: Token;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;
  let address2: SignerWithAddress;
  let address3: SignerWithAddress;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    [owner, address1, address2, address3] = await ethers.getSigners();
    await token.deployed();
  });

  describe("Deployment", () => {
    it("Should return token name", async () => {
      expect(await token.name()).to.equal("Leocode Token");
    });

    it("Should return token symbol", async () => {
      expect(await token.symbol()).to.equal("LEO");
    });

    it("Should return total supply", async () => {
      expect(await token.totalSupply()).to.equal(
        BigNumber.from(`${TOTAL_SUPPLY}`).mul(BigNumber.from(10).pow(DECIMALS))
      );
    });

    it("Should set the right owner", async () => {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign all tokens to the owner", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should not have any assets at not owner address", async () => {
      const address1Balance = await token.balanceOf(address1.address);
      expect(address1Balance).to.equal(0);
    });
  });

  describe("Transactions", () => {
    it("Should not transfer to 0 address", async () => {
      await expect(
        token.transfer(ethers.constants.AddressZero, 400)
      ).to.be.revertedWith("Cannot transfer to zero address");
    });

    it("Should transfer when sufficient funds and update balance", async () => {
      const address1Balance = await token.balanceOf(address1.address);
      expect(address1Balance).to.equal(0);

      await token.transfer(address1.address, 4000);

      const address1BalanceUpdated = await token.balanceOf(address1.address);
      expect(address1BalanceUpdated).to.equal(4000);
    });

    it("Should not transfer when insufficient funds", async () => {
      const ownerBalance = await token.balanceOf(owner.address);

      await expect(
        token.transfer(address1.address, BigNumber.from(ownerBalance).add(1))
      ).to.be.revertedWith("Insufficient funds");
    });

    it("Should set allowance", async () => {
      const givenAllowance = 100;
      const address1Allowance = await token.allowance(
        owner.address,
        address1.address
      );

      expect(address1Allowance).to.equal(0);

      await token.approve(address1.address, givenAllowance);
      const address1AllowanceUpdated = await token.allowance(
        owner.address,
        address1.address
      );

      expect(address1AllowanceUpdated).to.equal(givenAllowance);
    });

    it("Should not set allowance for zero address", async () => {
      await expect(
        token.approve(ethers.constants.AddressZero, 1000)
      ).to.be.revertedWith("Cannot approve for zero address");
    });

    it("Should allow transfer within allowance", async () => {
      const givenAllowance = 100;
      await token.transfer(address1.address, 200);
      await token.connect(address1).approve(address2.address, givenAllowance);
      await token
        .connect(address2)
        .transferFrom(address1.address, address3.address, givenAllowance);

      expect(await token.balanceOf(address3.address)).to.equal(givenAllowance);
    });

    it("Should forbid transfer above allowance", async () => {
      const givenAllowance = 100;
      await token.transfer(address1.address, 200);
      await token.connect(address1).approve(address2.address, givenAllowance);
      await expect(
        token
          .connect(address2)
          .transferFrom(address1.address, address3.address, givenAllowance + 1)
      ).to.be.revertedWith("Insufficient spending funds");
    });

    it("Should forbid transfer from without allowance", async () => {
      await expect(
        token.transferFrom(address2.address, address1.address, 300)
      ).to.be.revertedWith("Insufficient spending funds");
    });
  });
});
