import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
//import "@nomiclabs/hardhat-etherscan";
import { config as dotenvConfig } from "dotenv";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

dotenvConfig();
const PRIVATE_KEY_LOCALHOST_HARDHAT = "0000000000000000000000000000000000000000000000000000000000000000";
const PRIVATE_KEY_BASE_SEPOLIA =
  `0x${process.env.PRIVATE_KEY}` || "0000000000000000000000000000000000000000000000000000000000000000";
const PRIVATE_KEY_BASE_HOLESKY =
  `0x${process.env.PRIVATE_KEY}` || "0000000000000000000000000000000000000000000000000000000000000000";
const INFURA_SEPOLIA_RPC_URL =
  process.env.INFURA_SEPOLIA_RPC_URL || "0000000000000000000000000000000000000000000000000000000000000000";
const INFURA_HOLESKY_RPC_URL =
  process.env.INFURA_HOLESKY_RPC_URL || "0000000000000000000000000000000000000000000000000000000000000000";

let PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    sepolia: {
      url: INFURA_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY_BASE_SEPOLIA],
      chainId: 11155111,
    },
    holesky: {
      url: INFURA_HOLESKY_RPC_URL,
      accounts: [PRIVATE_KEY_BASE_HOLESKY],
      chainId: 17000,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
