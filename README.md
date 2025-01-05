# Noble World - NFT Marketplace (Experimental project - MVP)

Noble World is a decentralized marketplace for buying and selling second-hand products, each accompanied by a digital certificate in the form of an NFT (ERC721). This project allows users to buy and sell items while ensuring their authenticity via blockchain. NFTs act as digital proof of ownership, adding an extra layer of security and transparency to each transaction.

Additionally, Noble World features a Factory that enables product manufacturers to create NFT collections for their products they wish to certify. This allows manufacturers to easily create and issue NFTs as certificates for their products, ensuring their authenticity and streamlining the certification process.

# Features

- Decentralized Marketplace: Buy and sell second-hand items with a digital certificate in the form of an NFT.
- NFT Factory for Manufacturers: Allows manufacturers to easily create NFT collections and certify their products.
- NFT Collection Creation and Management: Create unique NFT collections and add products for sale.

# Technical Architecture

The project is built with the following technologies:

- Frontend : Developed using Next.js for a fast and responsive user experience. The UI is styled using Tailwind CSS and ShadCN-UI.
- Smart Contracts : Deployed on the Holesky testnet and implement the ERC721 standard for NFT management. OpenZeppelin contracts was used for implementing proven security practices.
- Blockchain Interaction : Viem, Wagmi, Rainbowkit and ethers.js are used for interacting with the smart contracts.
- Deployment : Hardhat is used for compiling, testing, and deploying smart contracts.

# Prerequisites

Make sure you have the following tools installed:

Node.js (version 16.x or higher)
Yarn or npm
Metamask or another Ethereum wallet to interact with the dApp

# Installation

1. Clone the project:

```
git clone https://github.com/your-username/Noble-World.git
cd Noble-World
```

2. Install dependencies:

```
npm install
```

# or

yarn install

3. Configure the environment:
   Create a .env file at the root of the project and add necessary API keys and other configurations.

4. Run the project locally:

```
npm run dev

# or

yarn dev
```

Access the dApp at http://localhost:3000.

# Deploying Smart Contracts

1. Configure Hardhat: Make sure the hardhat.config.js file contains the correct network and private key information for contract deployment.

2. Deploy contracts on Holesky:

```
npx hardhat run scripts/deploy.js --network holesky
```

3. Verify contracts: After deployment, verify that the contract source code is published on Etherscan for transparency.

# Authors

Anis OUARED - Lead Developer - Your GitHub

# License

This project is licensed under the GPL-3.0 License.
