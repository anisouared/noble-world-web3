import { expect, assert } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { NWERC721 } from "../typechain-types";

describe("Tests Noble World Main Contract", function () {
  async function deployContractsFixture() {
    const feePercent = 10;
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    const NWFactoryContractFixture = await hre.ethers.deployContract("NWERC721Factory");
    await NWFactoryContractFixture.waitForDeployment();
    const NWMainContractFixture = await hre.ethers.deployContract("NWMain", [
      NWFactoryContractFixture.target,
      feePercent,
    ]);

    return {
      owner,
      addr1,
      addr2,
      NWFactoryContractFixture,
      NWMainContractFixture,
    };
  }

  async function deployContractsAndNFTCollectionFixture() {
    const feePercent = 10;
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    const NWFactoryContractFixture = await hre.ethers.deployContract("NWERC721Factory");
    await NWFactoryContractFixture.waitForDeployment();
    const NWMainContractFixture = await hre.ethers.deployContract("NWMain", [
      NWFactoryContractFixture.target,
      feePercent,
    ]);

    const nftCollectionsFixture = await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI"
    );
    const nftCollections = await NWFactoryContractFixture.getCollectionsCreated();
    const firstNftCollectionAddressFixture = nftCollections[0];

    return {
      owner,
      addr1,
      addr2,
      NWFactoryContractFixture,
      nftCollectionsFixture,
      firstNftCollectionAddressFixture,
      NWMainContractFixture,
    };
  }

  async function deployContractsAndEscrowItemFixture() {
    const feePercent = 10;
    const [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();

    const NWFactoryContractFixture = await hre.ethers.deployContract("NWERC721Factory");
    await NWFactoryContractFixture.waitForDeployment();
    const NWMainContractFixture = await hre.ethers.deployContract("NWMain", [
      NWFactoryContractFixture.target,
      feePercent,
    ]);

    const nftCollectionsFixture = await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI"
    );
    const nftCollections = await NWFactoryContractFixture.getCollectionsCreated();
    const firstNftCollectionAddressFixture = nftCollections[0];

    await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 1

    const idFirstToken = 1;

    const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);
    await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, idFirstToken);
    await NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](idFirstToken, 1000);

    return {
      owner,
      addr1,
      addr2,
      addr3,
      NWFactoryContractFixture,
      firstNftCollectionAddressFixture,
      NWMainContractFixture,
    };
  }

  describe("Tests contract deployment", function () {
    it("Should DEPLOY Noble World Factory contract and set the correct owner", async function () {
      const { owner, NWFactoryContractFixture } = await loadFixture(deployContractsAndNFTCollectionFixture);
      let NWFactoryContractOwner = await NWFactoryContractFixture.owner();
      let deploymentOwnerAddress = await owner.getAddress();

      assert(NWFactoryContractOwner, deploymentOwnerAddress);
    });

    it("Should DEPLOY Noble World Main contract and set the correct owner", async function () {
      const { owner, NWMainContractFixture } = await loadFixture(deployContractsAndNFTCollectionFixture);

      let NWMainContractOwner = await NWMainContractFixture.owner();
      let deploymentOwnerAddress = await owner.getAddress();

      assert(NWMainContractOwner, deploymentOwnerAddress);
    });
  });

  describe("Tests Escrow function", function () {
    it("Should REVERT if price of item in Wei is not greater than zero", async function () {
      const { NWMainContractFixture, firstNftCollectionAddressFixture, addr1 } = await loadFixture(
        deployContractsAndNFTCollectionFixture
      );

      await expect(
        NWMainContractFixture.connect(addr1)["escrowItem(address,uint256,uint256)"](
          firstNftCollectionAddressFixture,
          1,
          0
        )
      ).to.be.revertedWith("Price of the item must be specified");
    });

    it("Should REVERT if caller is not owner of the NFT (token)", async function () {
      const { NWMainContractFixture, NWFactoryContractFixture, firstNftCollectionAddressFixture, addr1, addr2 } =
        await loadFixture(deployContractsAndNFTCollectionFixture);
      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 1

      await expect(
        NWMainContractFixture.connect(addr2)["escrowItem(address,uint256,uint256)"](
          firstNftCollectionAddressFixture,
          1,
          1
        )
      ).to.be.rejectedWith("You are not the owner of this NFT");
    });

    it("Should EMIT an event when the token is escrowed into Noble World Contract", async function () {
      const { NWMainContractFixture, NWFactoryContractFixture, firstNftCollectionAddressFixture, addr1 } =
        await loadFixture(deployContractsAndNFTCollectionFixture);

      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 1

      const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);
      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, 1);

      const tx = await NWMainContractFixture.connect(addr1)["escrowItem(address,uint256,uint256)"](
        firstNftCollectionAddressFixture,
        1,
        1
      );

      const txReceipt = await tx.wait();

      if (!txReceipt) {
        throw new Error("Transaction failed or was not mined.");
      }

      const block = await hre.ethers.provider.getBlock(txReceipt.blockNumber);

      await expect(tx)
        .to.emit(NWMainContractFixture, "EscrowedItems")
        .withArgs(0, 1, addr1, firstNftCollectionAddressFixture, 1, block?.timestamp);
    });

    it("Should ESCROW minted tokens into Noble World Contract", async function () {
      const { NWMainContractFixture, NWFactoryContractFixture, firstNftCollectionAddressFixture, owner, addr1, addr2 } =
        await loadFixture(deployContractsAndNFTCollectionFixture);

      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 1
      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 2

      const idFirstToken = 1;
      const idSecondToken = 2;

      const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);
      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, idFirstToken);
      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, idSecondToken);

      await NWMainContractFixture.connect(addr1)["escrowItem(address,uint256,uint256)"](
        firstNftCollectionAddressFixture,
        idFirstToken,
        1000
      );

      await NWMainContractFixture.connect(addr1)["escrowItem(address,uint256,uint256)"](
        firstNftCollectionAddressFixture,
        idSecondToken,
        2000
      );

      const itemsIdsForSale = await NWMainContractFixture.getItemsIdsForSale(addr1);

      expect(itemsIdsForSale[0]).to.equal(0);
      expect(itemsIdsForSale[1]).to.equal(1);
    });

    it("Should REVERT when NFT collection is not recognized, using simplified function", async function () {
      const { NWMainContractFixture, addr1 } = await loadFixture(deployContractsFixture);

      await expect(NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](1, 1)).to.be.rejectedWith(
        "Collection was not recognized, it is not possible to escrow an item"
      );
    });

    it("Should REVERT if price of item in Wei is not greater than zero, using simplified function", async function () {
      const { NWMainContractFixture, addr1 } = await loadFixture(deployContractsAndNFTCollectionFixture);

      await expect(NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](1, 0)).to.be.revertedWith(
        "Price of the item must be specified"
      );
    });

    it("Should ESCROW minted tokens into Noble World Contract, using simplified function", async function () {
      const { NWMainContractFixture, NWFactoryContractFixture, firstNftCollectionAddressFixture, addr1 } =
        await loadFixture(deployContractsAndNFTCollectionFixture);

      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 1
      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 2

      const idFirstToken = 1;

      const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);
      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, idFirstToken);

      const tx = await NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](idFirstToken, 1000);

      const txReceipt = await tx.wait();

      if (!txReceipt) {
        throw new Error("Transaction failed or was not mined.");
      }

      const block = await hre.ethers.provider.getBlock(txReceipt.blockNumber);

      await expect(tx)
        .to.emit(NWMainContractFixture, "EscrowedItems")
        .withArgs(0, 1, addr1, firstNftCollectionAddressFixture, 1000, block?.timestamp);
    });
  });

  describe("Tests Buy Function", function () {
    it("Should REVERT if not enough funds provided to buy the item", async function () {
      const { addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await expect(NWMainContractFixture.connect(addr2).buyItem(0)).to.be.rejectedWith("Not enough funds provided");
    });

    it("Should REVERT if status of sale is not Escrowed", async function () {
      const { addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });
      await NWMainContractFixture.connect(addr2).cancelSale(0);

      await expect(NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 })).to.be.rejectedWith(
        "Item not escrowed"
      );
    });

    it("Should EMIT an event when sale is purchased", async function () {
      const { addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      const tx = await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });
      const txReceipt = await tx.wait();

      if (!txReceipt) {
        throw new Error("Transaction failed or was not mined.");
      }

      const block = await hre.ethers.provider.getBlock(txReceipt.blockNumber);

      await expect(tx)
        .to.emit(NWMainContractFixture, "PaidItems(uint256 indexed,address indexed,uint256)")
        .withArgs(0, addr2, block?.timestamp);
    });
  });

  describe("Tests Validation of Sale", function () {
    it("Should REVERT if the caller is not the buyer", async function () {
      const { addr1, addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });

      await expect(NWMainContractFixture.connect(addr1).validateItem(0)).to.be.rejectedWith(
        "You are not the item buyer"
      );
    });

    it("Should REVERT if status of sale is not Purchasing", async function () {
      const { addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });
      await NWMainContractFixture.connect(addr2).validateItem(0);

      await expect(NWMainContractFixture.connect(addr2).validateItem(0)).to.be.rejectedWith(
        "Item has not been repurchased"
      );
    });

    it("Should EMIT an event when sale is validated", async function () {
      const { addr1, addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });

      const tx = await NWMainContractFixture.connect(addr2).validateItem(0);

      const txReceipt = await tx.wait();

      if (!txReceipt) {
        throw new Error("Transaction failed or was not mined.");
      }

      const block = await hre.ethers.provider.getBlock(txReceipt.blockNumber);

      await expect(tx)
        .to.emit(NWMainContractFixture, "SoldItems(uint256,address indexed,address indexed,uint256,uint256,uint256)")
        .withArgs(0, addr1, addr2, 900, 100, block?.timestamp);
    });
  });

  describe("Tests Cancellation of Sale", function () {
    it("Should REVERT if caller is not buyer or seller", async function () {
      const { addr2, addr3, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });

      await expect(NWMainContractFixture.connect(addr3).cancelSale(0)).to.be.rejectedWith(
        "Must be a buyer or seller of the item"
      );
    });

    it("Should CANCEL sale buy seller when status is Escrowed", async function () {
      const { addr1, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr1).cancelSale(0);

      await expect(NWMainContractFixture.connect(addr1).cancelSale(0)).to.be.rejectedWith("Unable to cancel sale");
    });

    it("Should REVERT when status of sale is not Purchasing", async function () {
      const { addr1, addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });
      await NWMainContractFixture.connect(addr2).validateItem(0);

      await expect(NWMainContractFixture.connect(addr1).cancelSale(0)).to.be.revertedWith("Unable to cancel sale");
    });

    it("Should REVERT when buyer already requested cancellation", async function () {
      const { addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });

      await NWMainContractFixture.connect(addr2).cancelSale(0);

      await expect(NWMainContractFixture.connect(addr2).cancelSale(0)).to.be.rejectedWith(
        "Buyer already requested cancellation"
      );
    });

    it("Should REVERT when seller already requested cancellation", async function () {
      const { addr1, addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });
      await NWMainContractFixture.connect(addr1).cancelSale(0);

      await expect(NWMainContractFixture.connect(addr1).cancelSale(0)).to.be.rejectedWith(
        "Seller already requested cancellation"
      );
    });

    it("Should EMIT an event if sale has been successfully cancelled", async function () {
      const { addr1, addr2, NWMainContractFixture } = await loadFixture(deployContractsAndEscrowItemFixture);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });
      await NWMainContractFixture.connect(addr1).cancelSale(0);

      const tx = await NWMainContractFixture.connect(addr2).cancelSale(0);

      const txReceipt = await tx.wait();

      if (!txReceipt) {
        throw new Error("Transaction failed or was not mined.");
      }

      const block = await hre.ethers.provider.getBlock(txReceipt.blockNumber);

      await expect(tx)
        .to.emit(NWMainContractFixture, "SaleConcellation(uint256, uint256)")
        .withArgs(0, block?.timestamp);
    });
  });

  describe("Tests Getters & Setters functions", function () {
    it("Should CHANGE fee account", async function () {
      const { addr2, NWMainContractFixture } = await loadFixture(deployContractsFixture);

      await NWMainContractFixture.changeFeeAccount(addr2);
      const newFeeAccount = await NWMainContractFixture.feeAccount();

      expect(await NWMainContractFixture.feeAccount()).to.equal(newFeeAccount);
    });

    it("Should REVERT if we try to change the fee percent to a value greater than thirty", async function () {
      const { NWMainContractFixture } = await loadFixture(deployContractsFixture);

      await expect(NWMainContractFixture.changeFeePercent(40)).to.be.rejectedWith(
        "Percentage of fees cannot exceed 30%"
      );
    });

    it("Should CHANGE fee percent", async function () {
      const { NWMainContractFixture } = await loadFixture(deployContractsFixture);

      await NWMainContractFixture.changeFeePercent(25);
      const newFeePercent = await NWMainContractFixture.feePercent();

      expect(await NWMainContractFixture.feePercent()).to.equal(newFeePercent);
    });

    it("Should RETRIEVE a batch of items by their Ids", async function () {
      const { NWMainContractFixture, NWFactoryContractFixture, firstNftCollectionAddressFixture, addr1 } =
        await loadFixture(deployContractsAndNFTCollectionFixture);

      await NWFactoryContractFixture.getCollectionsCreated();

      const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);

      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 1
      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 2
      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 3
      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 4
      await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 5

      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, 1);
      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, 2);
      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, 3);
      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, 4);
      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, 5);

      await NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](1, 1000);
      await NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](2, 2000);
      await NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](3, 3000);
      await NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](4, 4000);
      await NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](5, 5000);

      const batch = await NWMainContractFixture.getItemsBatch([2, 3, 5]);
      expect(batch.length).to.equal(3);
    });

    it("Should RETRIEVE Ids of items for which a given buyer has started the purchase", async function () {
      const { addr1, addr2, NWFactoryContractFixture, firstNftCollectionAddressFixture, NWMainContractFixture } =
        await loadFixture(deployContractsAndEscrowItemFixture);

      const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);

      await NWFactoryContractFixture.connect(addr1)["mint(address)"](firstNftCollectionAddressFixture); // Token 2
      await NWFactoryContractFixture.connect(addr1)["mint(address)"](firstNftCollectionAddressFixture); // Token 3

      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, 2);
      await firstNftCollection.connect(addr1).approve(NWMainContractFixture.target, 3);

      await NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](2, 2000);
      await NWMainContractFixture.connect(addr1)["escrowItem(uint256,uint256)"](3, 3000);

      await NWMainContractFixture.connect(addr2).buyItem(0, { value: 1000 });
      await NWMainContractFixture.connect(addr2).buyItem(1, { value: 2000 });
      await NWMainContractFixture.connect(addr2).buyItem(2, { value: 3000 });

      const itemsIdsForPurchase = await NWMainContractFixture.getItemsIdsForPurchase(addr2);

      expect(itemsIdsForPurchase.length).to.be.equal(3);
    });
  });
});
