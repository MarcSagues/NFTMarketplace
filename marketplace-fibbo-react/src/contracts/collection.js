import { ethers } from "ethers";
import { useApi } from "../api";
import useProvider from "../hooks/useProvider";
import { sendMetaTx } from "./meta";
import { useTokens } from "./token";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useCollections = () => {
  const { registerNftRoyalties, uploadJSONMetadata } = useApi();
  const { getERC721Contract } = useTokens();
  const { createProvider } = useProvider();

  const setFreezedMetadata = async (collection, tokenInfo, tokenId) => {
    try {
      const contract = await getERC721Contract(collection);
      const provider = createProvider();
      await window.ethereum.enable();
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = userProvider.getSigner();
      const from = await signer.getAddress();

      const ipfsCID = await uploadJSONMetadata(
        tokenInfo.name,
        tokenInfo.description,
        tokenInfo.ipfsImage,
        tokenInfo.externalLink
      );

      const ipfsFileURL = `https://ipfs.io/ipfs/${ipfsCID}`;

      await sendMetaTx(contract, provider, signer, {
        functionName: "setFreezedMetadata",
        args: [tokenId, ipfsFileURL],
      });

      // Actualizar royalties
      await registerNftRoyalties(contract.address, tokenId, tokenInfo.royalty);
    } catch (e) {
      console.log(e);
    }
  };

  const checkFreezedMetadata = async (collection, tokenId) => {
    const contract = await getERC721Contract(collection);

    return contract.isFreezedMetadata(tokenId);
  };

  return {
    setFreezedMetadata,
    checkFreezedMetadata,
  };
};
