import axios from "axios";
import { ethers } from "ethers";
import { Contracts } from "../constants/networks";
import useContract from "../hooks/useContract";
import useProvider from "../hooks/useProvider";
import { calculateGasMargin, getHigherGWEI } from "../utils/gas";
import { COLLECTION_ABI, FACTORY_ABI } from "./abi";
import { useAddressRegistry } from "./addressRegistry";
import { createForwarderInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";
import { useTokens } from "./token";
import { ChainId } from "@sushiswap/sdk";
import { sendMetaTx } from "./meta";

const forwarder = Contracts[ChainId.FANTOM_TESTNET].minimalForwarder;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useFactory = () => {
  const { getFactoryAddress, getAuctionAddress, getMarketplaceAddress } =
    useAddressRegistry();
  const { createProvider } = useProvider();
  const { getContract } = useContract();
  const { getERC721Contract } = useTokens();
  /*   const { createProvider } = useProvider(); */

  const getContractAddress = async () => await getFactoryAddress();

  const getFactoryContract = async () => {
    const address = await getFactoryAddress();
    return await getContract(address, FACTORY_ABI);
  };

  const createNFTContract = async (name, symbol, from) => {
    const factoryContract = await getFactoryContract();
    const args = [name, symbol, forwarder];

    const options = {
      from,
      gasPrice: getHigherGWEI(),
    };

    const gasEstimate = await factoryContract.estimateGas.createNFTContract(
      ...args,
      options
    );
    options.gasLimit = calculateGasMargin(gasEstimate);
    return await factoryContract.createNFTContract(...args, options);
  };

  const approveCollection = async (wallet, contractAddress) => {
    const contract = await getERC721Contract(contractAddress);
    const auctionAddress = await getAuctionAddress();
    const marketAddress = await getMarketplaceAddress();

    const isApprovedAuctionForAll = await contract.isApprovedForAll(
      wallet,
      auctionAddress
    );
    if (!isApprovedAuctionForAll) {
      const approveAuctionTx = await contract.setApprovalForAll(
        auctionAddress,
        true
      );
      await approveAuctionTx.wait();
    }

    const isApprovedMarkerForAll = await contract.isApprovedForAll(
      wallet,
      marketAddress
    );

    if (!isApprovedMarkerForAll) {
      const approveMarketTx = await contract.setApprovalForAll(
        marketAddress,
        true
      );
      await approveMarketTx.wait();
    }
  };

  const createNFTContractGasless = async (name, symbol) => {
    const factoryContract = await getFactoryContract();
    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    await sendMetaTx(factoryContract, provider, signer, {
      functionName: "createNFTContract",
      args: [name, symbol, forwarder],
    });

    await sleep(12000);
  };

  return {
    getContractAddress,
    getFactoryContract,
    createNFTContract,
    approveCollection,
    createNFTContractGasless,
  };
};
