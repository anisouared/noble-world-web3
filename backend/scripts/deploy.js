async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account : ", deployer.address);

    // Deploy contracts here :
    // const NWERC721FactoryContainer = await ethers.getContractFactory("NWERC721Factory");
    // const NWERC721Factory = await NWERC721FactoryContainer.deploy();
    // NWERC721Factory.waitForDeployment();
    // console.log("NWERC721Factory contract address :", NWERC721Factory.target);

    const NWMainContainer = await ethers.getContractFactory("NWMain");
    const NWMain = await NWMainContainer.deploy("0x463fcA0B2c55fF26550B505a32a03ad956DE7bD8", 10);

    console.log("NWMain contract address :", NWMain.target);

    //modifyFrontendFiles(NWERC721Factory, "NWERC721Factory");
    modifyFrontendFiles(NWMain, "NWMain");
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