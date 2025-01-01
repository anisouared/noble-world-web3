async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account : ", deployer.address);

  // Deploy contracts here :
  const NWERC721FactoryContainer = await ethers.getContractFactory("NWERC721Factory");
  const NWERC721Factory = await NWERC721FactoryContainer.deploy();
  NWERC721Factory.waitForDeployment(10);
  console.log("NWERC721Factory contract address :", NWERC721Factory.target);

  const NWMainContainer = await ethers.getContractFactory("NWMain");
  const NWMain = await NWMainContainer.deploy(NWERC721Factory.target, 10);
  //const NWMain = await NWMainContainer.deploy("0x7DcA81576Cd495e4eD373aB83E36CeFd218ee4f0", 10);

  console.log("NWMain contract address :", NWMain.target);

  modifyFrontendFiles(NWERC721Factory, "NWERC721Factory");
  modifyFrontendFiles(NWMain, "NWMain");
}

function modifyFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = `${__dirname}/../../frontend/constants/contractsData`;

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(`${contractsDir}/${name}-address.json`, JSON.stringify({ address: contract.target }, undefined, 2));

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(`${contractsDir}/${name}.json`, JSON.stringify(contractArtifact, null, 2));
}

main();
