const {
  frontEndContractsFile,
  frontEndContractsFile2,
  frontEndAbiLocation,
  frontEndAbiLocation2,
} = require("../helper-hardhat-config");
require("dotenv").config();
const fs = require("fs");
const { network } = require("hardhat");

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Writing to front end...");
    await updateContractAddresses();
    await updateAbi();
    console.log("Front end written!");
  }
};

async function updateAbi() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  // fs.writeFileSync(
  //   `${frontEndAbiLocation}NftMarketplace.json`,
  //   nftMarketplace.interface.formatJson()
  // );
  fs.writeFileSync(
    `${frontEndAbiLocation2}NftMarketplace.json`,
    nftMarketplace.interface.formatJson()
  );

  const basicNft = await ethers.getContract("BasicNft");
  // fs.writeFileSync(
  //   `${frontEndAbiLocation}BasicNft.json`,
  //   basicNft.interface.formatJson()
  // );
  fs.writeFileSync(
    `${frontEndAbiLocation2}BasicNft.json`,
    basicNft.interface.formatJson()
  );
}

async function updateContractAddresses() {
  const chainId = network.config.chainId.toString();
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile2, "utf8")
  );
  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["NftMarketplace"].includes(
        nftMarketplace.target
      )
    ) {
      contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.target);
    }
  } else {
    contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.target] };
  }
  // fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
  fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses));
}
module.exports.tags = ["all", "frontend"];
