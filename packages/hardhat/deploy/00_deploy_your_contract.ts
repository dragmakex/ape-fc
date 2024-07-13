import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
/**
 * Deploys the ApeFightClub contract using the deployer account and
 * constructor arguments set to the appropriate values.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployApeFightClub: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Define the entry fee and ApeCoin address for the constructor arguments
  const entryFee = ethers.parseUnits("1", 18); // Example entry fee of 1 ApeCoin
  const apeCoinAddress = "0x1234567890abcdef1234567890abcdef12345678"; // Replace with actual ApeCoin contract address

  await deploy("ApeFightClub", {
    from: deployer,
    // Contract constructor arguments
    args: [entryFee, apeCoinAddress],
    log: true,
    autoMine: true,
  });
};

export default deployApeFightClub;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags ApeFightClub
deployApeFightClub.tags = ["ApeFightClub"];