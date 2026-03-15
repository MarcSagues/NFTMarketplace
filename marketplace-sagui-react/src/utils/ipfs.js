import { create as ipfsHttpClient } from "ipfs-http-client";

const ipfsClient = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const addImgToIpfs = async (file) => {
  const imgAddedToIPFS = await ipfsClient.add(file, {
    progress: (prog) => console.log(`received: ${prog}`),
  });

  return imgAddedToIPFS;
};

export const addJsonToIpfs = async (data) => {
  const ipfsCID = await ipfsClient.add(data);
  return ipfsCID;
};
