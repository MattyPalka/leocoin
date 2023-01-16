// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { artifacts, ethers } from "hardhat";
import { FakeUSDT, LeoToken, Marketplace, Leon } from "../typechain";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // We get the contract to deploy
  const LeoToken = await ethers.getContractFactory("LeoToken");
  const leoToken = await LeoToken.deploy();

  await leoToken.deployed();

  console.log("LeoToken deployed to address:", leoToken.address);

  const USDTToken = await ethers.getContractFactory("FakeUSDT");
  const usdtToken = await USDTToken.deploy()

  await usdtToken.deployed()

  console.log("USDT deployed to address:", usdtToken.address);

  const NFT = await ethers.getContractFactory("Leon");
  const nft = await NFT.deploy()

  await nft.deployed()

  console.log("NFT deployed to address:", nft.address);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(leoToken.address, usdtToken.address, nft.address);

  await marketplace.deployed();

  console.log("Marketplace deployed to address:", marketplace.address);

  await usdtToken.giveTokens(marketplace.address, ethers.utils.parseUnits("100000", 6));
  await leoToken.transferFrom(leoToken.address, marketplace.address, ethers.utils.parseUnits("50000", 18));
  console.log('Initial tokens given')
  

  saveFrontendFiles(leoToken, usdtToken, marketplace, nft);
}

function saveFrontendFiles(leoToken: LeoToken, usdtToken: FakeUSDT, marketplace: Marketplace, nft: Leon) {
  const fs = require("fs");
  const path = require("path");
  const contractsDir = path.join(__dirname, "/../frontend/src/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-addresses.json",
    JSON.stringify({ LeoToken: leoToken.address,
                     USDTToken: usdtToken.address,
                     Marketplace: marketplace.address ,
                     LeonNFT: nft.address
                    }, undefined, 2)
  );

  const LeoTokenArtifact = artifacts.readArtifactSync("LeoToken");
  fs.writeFileSync(
    contractsDir + "/LeoToken.json",
    JSON.stringify(LeoTokenArtifact, null, 2)
  );

  const UsdtTokenArtifact = artifacts.readArtifactSync("FakeUSDT");
  fs.writeFileSync(
    contractsDir + "/UsdtToken.json",
    JSON.stringify(UsdtTokenArtifact, null, 2)
  );

  const MarketplaceArtifact = artifacts.readArtifactSync("Marketplace");
  fs.writeFileSync(
    contractsDir + "/Marketplace.json",
    JSON.stringify(MarketplaceArtifact, null, 2)
  );

  const LeonNFTArtifact = artifacts.readArtifactSync("Leon");
  fs.writeFileSync(
    contractsDir + "/LeonNft.json",
    JSON.stringify(LeonNFTArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
