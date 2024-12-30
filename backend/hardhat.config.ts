import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
//import "@nomiclabs/hardhat-etherscan";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const INFURA_SEPOLIA_RPC_URL = process.env.INFURA_SEPOLIA_RPC_URL || "";
const INFURA_HOLESKY_RPC_URL = process.env.INFURA_HOLESKY_RPC_URL || "";

let PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: INFURA_SEPOLIA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
    },
    holesky: {
      url: INFURA_HOLESKY_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
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
