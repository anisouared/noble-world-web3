async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account : ", deployer.address);

    // Deploy contracts here :
    //const NWERC721Factory = await ethers.getContractFactory("NWERC721Factory");
    //const NWERC721FactoryInstant = await NWERC721Factory.deploy();
    //console.log("NWERC721Factory contract address :", NWERC721FactoryInstant.target);

    //const NWERC721Container = await ethers.getContractFactory("NWERC721");
    //const NWERC721 = await NWERC721Container.deploy();
    //console.log("NWERC721 contract address :", NWERC721.target);

    //await NWERC721.waitForDeployment(20);
    // await hre.run("verify:verify", {
    //     //network: network.name,
    //     address: NWERC721.target,
    //     constructorArguments: [],
    // });
    // console.log("Etherscan NWERC721 verification done. ✅");

    const NWMainContainer = await ethers.getContractFactory("NWMain");
    const NWMain = await NWMainContainer.deploy(2);

    console.log("NWMain contract address :", NWMain.target);

    //modifyFrontendFiles(NWERC721, "NWERC721");
    modifyFrontendFiles(NWMain, "NWMain");

    //const NWMainFactory = await ethers.getContractFactory("NWMain");
    //const NWMain = await NWMainFactory.deploy(2);
    //console.log("NWMain contract address :", NWMain.target);

    // Save information for each contract after deployment (ABI & address)
    //modifyFrontendFiles(NWERC721FactoryInstant, "NWERC721Factory");
    //modifyFrontendFiles(NWMain, "NWMain");
}

function modifyFrontendFiles(contract, name) {
    const fs = require("fs");
    const contractsDir = `${__dirname}/../../frontend/constants/contractsData`;

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        `${contractsDir}/${name}-address.json`,
        JSON.stringify({ address: contract.target }, undefined, 2)
    );

    const contractArtifact = artifacts.readArtifactSync(name);

    fs.writeFileSync(
        `${contractsDir}/${name}.json`,
        JSON.stringify(contractArtifact, null, 2)
    );
}

main()