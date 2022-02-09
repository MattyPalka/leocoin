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

    it("Should allow owner to spent all tokens", async () => {
      expect(await token.allowance(token.address, owner.address)).to.equal(
        await token.totalSupply()
      );
    });
  });

  describe("Transactions", () => {
    it("Should not transfer to 0 address", async () => {
      await expect(
        token.transfer(ethers.constants.AddressZero, 400)
      ).to.be.revertedWith("Cannot transfer to zero address");
    });

    it("Should allow to withdraw LEO for owner", async () => {
      await token.withdrawLeo(10_000);
      expect(await token.balanceOf(owner.address)).to.equal(10_000);
    });

    it("Should not allow to withdraw LEO for other than owner address", async () => {
      await expect(
        token.connect(address1).withdrawLeo(10_000)
      ).to.be.revertedWith("Only owner can withdraw LEO");
    });

    it("Should transfer when sufficient funds and update balance", async () => {
      const address1Balance = await token.balanceOf(address1.address);
      expect(address1Balance).to.equal(0);
      await token.withdrawLeo(10_000);

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
      await token.withdrawLeo(10_000);
      await token.transfer(address1.address, 200);
      await token.connect(address1).approve(address2.address, givenAllowance);
      await token
        .connect(address2)
        .transferFrom(address1.address, address3.address, givenAllowance);

      expect(await token.balanceOf(address3.address)).to.equal(givenAllowance);
    });

    it("Should forbid transfer above allowance", async () => {
      const givenAllowance = 100;
      await token.withdrawLeo(10_000);
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

  describe("Purchase", () => {
    it("Should not be able to purchase LEO for 0 ETH", async () => {
      await expect(
        token.connect(address1).buy({ value: ethers.utils.parseEther("0") })
      ).to.be.revertedWith("Minimum 1 wei to buy LEO");
    });

    it("Should be able to purchase LEO with ETH", async () => {
      const ethPurchaseAmount = 4;
      await token
        .connect(address1)
        .buy({ value: ethers.utils.parseEther(`${ethPurchaseAmount}`) });

      expect(await token.balanceOf(address1.address)).to.equal(
        BigNumber.from(`${ethPurchaseAmount * 100}`).mul(
          BigNumber.from(10).pow(DECIMALS)
        )
      );
    });

    it("Should not be able to spend LEO when still vested", async () => {
      const ethPurchaseAmount = 2;
      await token
        .connect(address1)
        .buy({ value: ethers.utils.parseEther(`${ethPurchaseAmount}`) });

      await expect(
        token.connect(address1).transfer(address2.address, 100)
      ).to.be.revertedWith("Funds still vested");
    });

    it("Should be able to spend LEO when funds no longer vested", async () => {
      const ethPurchaseAmount = 2;
      await token
        .connect(address1)
        .buy({ value: ethers.utils.parseEther(`${ethPurchaseAmount}`) });

      await ethers.provider.send("evm_increaseTime", [86400 * 8]);

      await token.connect(address1).transfer(address2.address, 100);
      expect(await token.balanceOf(address2.address)).to.equal(100);
    });
  });
});
