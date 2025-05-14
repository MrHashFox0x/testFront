import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Test = await ethers.getContractFactory("test");
    const test = await Test.deploy();
    await test.waitForDeployment();
    console.log("Test.sol deployed to:", await test.getAddress());
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });










