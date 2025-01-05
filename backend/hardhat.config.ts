import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
//import "@nomiclabs/hardhat-etherscan";
import { config as dotenvConfig } from "dotenv";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

dotenvConfig();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    // sepolia: {
    //   url: process.env.INFURA_SEPOLIA_RPC_URL,
    //   accounts: [`0x${process.env.PRIVATE_KEY}`],
    //   chainId: 11155111,
    // },
    // holesky: {
    //   url: process.env.INFURA_HOLESKY_RPC_URL,
    //   accounts: [`0x${process.env.PRIVATE_KEY}`],
    //   chainId: 17000,
    // },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

if (
  process.env.PRIVATE_KEY &&
  process.env.PRIVATE_KEY.length === 64 &&
  process.env.INFURA_HOLESKY_RPC_URL &&
  process.env.ETHERSCAN_API_KEY
) {
  config.networks.holesky = {
    url: process.env.INFURA_HOLESKY_RPC_URL,
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    chainId: 17000,
  };

  config.etherscan = {
    apiKey: process.env.ETHERSCAN_API_KEY,
  };
}

export default config;
