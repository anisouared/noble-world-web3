import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Tests Factory NFT Noble World Contract", function () {
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

  it("Should CREATE new NFT Collection", async function () {
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

    const block = await hre.ethers.provider.getBlock(txReceipt.blockNumber);

    const nftCollections = await NWFactoryContractFixture.getCollectionsCreated();

    const firstNftCollectionAddressFixture = nftCollections[0];

    await expect(tx)
      .to.emit(NWFactoryContractFixture, "NFTCollectionsCreated")
      .withArgs(
        "Test Collection Name",
        firstNftCollectionAddressFixture,
        "https://test.collection.URI/",
        block?.timestamp
      );
  });

  it("Should TRANSFER Ownership", async function () {
    const { addr1, NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI/"
    );

    await NWFactoryContractFixture.transferOwnership(addr1);

    const newOwner = await NWFactoryContractFixture.owner();

    expect(newOwner).to.be.equal(addr1);
  });

  it("Should MINT only if there is a collection that has been created", async function () {
    const { addr1, NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    await expect(NWFactoryContractFixture.connect(addr1)["mint()"]()).to.rejectedWith("No collection has been created");
  });

  it("Should RETURN created NFT collections", async function () {
    const { NWFactoryContractFixture } = await loadFixture(deployContractsFixture);

    await NWFactoryContractFixture.createNFTCollection(
      "Test Collection Name",
      "Test Collection Symbol",
      "https://test.collection.URI/"
    );

    await NWFactoryContractFixture.createNFTCollection(
      "Test 2 Collection Name",
      "Test 2 Collection Symbol",
      "https://test2.collection.URI/"
    );

    const nftCollections = await NWFactoryContractFixture.getCollectionsCreated();

    expect(nftCollections.length).to.be.equal(2);
  });
});
