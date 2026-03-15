const { getConstants } = require("../constants");

async function main(network) {
  console.log("Network is ", network.name);

  const { ADDRESS_REGISTRY } = getConstants(network);

  const addressRegistry = await ethers.getContractAt(
    "SaguiAddressRegistry",
    ADDRESS_REGISTRY
  );

  const marketplaceAddress = await addressRegistry.marketplace();
  const DefaultCollection = await ethers.getContractFactory(
    "SaguiArtTradeable"
  );
  const defaultCollection = await DefaultCollection.deploy(
    "Default Sagui",
    "FBBO",
    marketplaceAddress
  );

  await defaultCollection.deployed();

  console.log("DefaultCollection deploted to: ", defaultCollection.address);
}

main(network)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

