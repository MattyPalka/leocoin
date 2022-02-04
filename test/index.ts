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

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    [owner, address1] = await ethers.getSigners();
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
      expect(await token.balanceOf(address1.address)).to.equal(address1Balance);
    });
  });

  describe("Transactions", () => {
    it("Should not transfer to 0 address", async () => {});
    it("Should transfer when sufficient funds and update balance", async () => {});
    it("Should not transfer when insufficient funds", async () => {});

    it("Should set allowance", async () => {
      const address1Allowance = await token.allowance(
        owner.address,
        address1.address
      );
      expect(address1Allowance).to.equal(0);
      const givenAllowance = 100;
      await token.setAllowance(address1.address, givenAllowance);
      const address1AllowanceUpdated = await token.allowance(
        owner.address,
        address1.address
      );
      expect(address1AllowanceUpdated).to.equal(givenAllowance);
    });

    it("Should not set allowance for zero address", async () => {
      await expect(
        token.setAllowance(ethers.constants.AddressZero, 1000)
      ).to.be.revertedWith("Cannot set for zero address");
    });

    it("Should allow transfer within allowance", async () => {});
    it("Should forbid transfer above allowance", async () => {});
  });
});
