import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { NWERC721 } from "../typechain-types";

describe("Tests ERC721 Noble World Main Contract", function () {
  async function deployContractsFixture() {
    const feePercent = 10;
    const [owner, addr1, addr2, addr3, addr4, addr5] = await hre.ethers.getSigners();

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
      addr3,
      addr4,
      addr5,
      NWFactoryContractFixture,
      NWMainContractFixture,
    };
  }

  it("Should RETRIEVE base URI of NFT Collection", async function () {
    const { NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI/"
    );
    const nftCollections = await NWFactoryContractFixture.getCollectionsCreated();
    const firstNftCollectionAddressFixture = nftCollections[0];

    const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);

    expect(await firstNftCollection.baseURI()).to.be.equal("https://test.collection.URI/");
  });

  it("Should RETRIEVE one token URI of an NFT Collection", async function () {
    const { addr1, NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI/"
    );

    await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 1

    const nftCollections = await NWFactoryContractFixture.getCollectionsCreated();
    const firstNftCollectionAddressFixture = nftCollections[0];

    const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);

    expect(await firstNftCollection.connect(addr1).tokenURI(1)).to.be.equal("https://test.collection.URI/1.json");
  });

  it("Should Mint NFT from collection", async function () {
    const { addr1, NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI/"
    );

    const nftCollections = await NWFactoryContractFixture.getCollectionsCreated();
    const firstNftCollectionAddressFixture = nftCollections[0];

    const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);

    expect(NWFactoryContractFixture["mint()"])
      .to.emit(firstNftCollection, "Transfer")
      .withArgs(firstNftCollectionAddressFixture, addr1, 1);
  });

  it("Should REVERT if Maximum number of mint per wallet has been reached", async function () {
    const { addr1, NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI/"
    );

    for (let i = 0; i < 10; i++) {
      await NWFactoryContractFixture.connect(addr1)["mint()"]();
    }

    await expect(NWFactoryContractFixture.connect(addr1)["mint()"]()).to.be.revertedWith(
      "Maximum number of mint per wallet has been reached"
    );
  });

  it("Should REVERT if maximum supply for mint has been exceeded for all users", async function () {
    const { addr1, addr2, addr3, addr4, addr5, NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI/"
    );

    for (let i = 0; i < 10; i++) {
      await NWFactoryContractFixture.connect(addr1)["mint()"]();
    }

    for (let i = 0; i < 10; i++) {
      await NWFactoryContractFixture.connect(addr2)["mint()"]();
    }

    for (let i = 0; i < 10; i++) {
      await NWFactoryContractFixture.connect(addr3)["mint()"]();
    }

    for (let i = 0; i < 10; i++) {
      await NWFactoryContractFixture.connect(addr4)["mint()"]();
    }

    await expect(NWFactoryContractFixture.connect(addr5)["mint()"]()).to.be.revertedWith("Max supply exceeded");
  });

  it("Should INITIALIZE NFT Collection using Factory Contract", async function () {
    const { NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    const tx = await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI/"
    );

    const txReceipt = await tx.wait();

    if (!txReceipt) {
      throw new Error("Transaction failed or was not mined.");
    }

    const nftCollections = await NWFactoryContractFixture.getCollectionsCreated();

    const firstNftCollectionAddressFixture = nftCollections[0];
    const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);

    expect(await firstNftCollection.baseURI()).to.be.equal("https://test.collection.URI/");
  });

  it("Should RETRIEVE empty token URI of an NFT Collection", async function () {
    const { addr1, NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    await NWFactoryContractFixture.createNFTCollection("Test Collection Name", "Test Collection Symbol", "");

    await NWFactoryContractFixture.connect(addr1)["mint()"](); // Token 1

    const nftCollections = await NWFactoryContractFixture.getCollectionsCreated();
    const firstNftCollectionAddressFixture = nftCollections[0];

    const firstNftCollection: NWERC721 = await hre.ethers.getContractAt("NWERC721", firstNftCollectionAddressFixture);

    expect(await firstNftCollection.connect(addr1).tokenURI(1)).to.be.equal("");
  });
});
