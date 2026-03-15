const { getConstants } = require("../constants");

async function main(network) {
  console.log("Network is ", network.name);

  const { ADDRESS_REGISTRY, FORWARDER } = getConstants(network);

  const addressRegistry = await ethers.getContractAt(
    "SaguiAddressRegistry",
    ADDRESS_REGISTRY
  );

  const tokenRegistryAddress = await addressRegistry.tokenRegistry();

  const tokenRegistry = await ethers.getContractAt(
    "SaguiTokenRegistry",
    tokenRegistryAddress
  );

  const SaguiWFTM = await ethers.getContractFactory("WrappedFtm");
  const wftmToken = await SaguiWFTM.deploy(FORWARDER);

  await wftmToken.deployed();

  console.log("Sagui WFTM deployed to: ", wftmToken.address);

  await tokenRegistry.add(wftmToken.address);
}

main(network)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

