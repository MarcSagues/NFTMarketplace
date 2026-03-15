import { ethers } from "ethers";
import useContract from "../hooks/useContract";
import useProvider from "../hooks/useProvider";
import { useFactory } from "./factory";

import {
  ERC1155_CONTRACT_ABI,
  ERC20_CONTRACT_ABI,
  ERC721_CONTRACT_ABI,
} from "./abi";
import { sendMetaTx } from "./meta";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useTokens = () => {
  const { getContract } = useContract();
  const { createProvider } = useProvider();
  const getERC20Contract = async (address) =>
    await getContract(address, ERC20_CONTRACT_ABI);

  const getERC721Contract = async (address) =>
    await getContract(address, ERC721_CONTRACT_ABI);

  const getERC1155Contract = async (address) =>
    await getContract(address, ERC1155_CONTRACT_ABI);

  const mintGassless = async (collectionAddress, wallet, tokenURI) => {
    const contract = await getERC721Contract(collectionAddress);
    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();
    await sendMetaTx(contract, provider, signer, {
      functionName: "mint",
      args: [wallet, tokenURI],
    });
    await sleep(12000);
  };

  const approvalForAllGasless = async (contract, addresToApprove) => {
    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    await sendMetaTx(contract, provider, signer, {
      functionName: "setApprovalForAll",
      args: [addresToApprove, true],
    });
  };

  const sendItemGassles = async (collectionAddress, from, to, tokenId) => {
    const contract = await getERC721Contract(collectionAddress);
    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();

    await sendMetaTx(contract, provider, signer, {
      functionName: "transferFrom",
      args: [from, to, tokenId],
    });
  };

  const burnItemGassles = async (collectionAddress, tokenId) => {
    const contract = await getERC721Contract(collectionAddress);
    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();

    await sendMetaTx(contract, provider, signer, {
      functionName: "burn",
      args: [tokenId],
    });
  };

  return {
    getERC20Contract,
    getERC721Contract,
    getERC1155Contract,
    mintGassless,
    approvalForAllGasless,
    sendItemGassles,
    burnItemGassles,
  };
};
