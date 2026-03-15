import { ethers } from "ethers";
import useContract from "../hooks/useContract";
import { MARKETPLACE_ABI } from "./abi";
import { useAddressRegistry } from "./addressRegistry";

import { formatEther, parseEther } from "ethers/lib/utils";
import { useTokens } from "./token";
import { useWFTMContract } from "./wftm";

import useAccount from "../hooks/useAccount";
import useProvider from "../hooks/useProvider";
import { sendMetaTx } from "./meta";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useMarketplace = () => {
  const { getERC20Contract, getERC721Contract, approvalForAllGasless } =
    useTokens();

  const { getWFTMBalance, wrapFTM, unwrapFTMGassless } = useWFTMContract();
  const { getMarketplaceAddress } = useAddressRegistry();
  const { wallet } = useAccount();
  const { createProvider } = useProvider();

  const { getContract } = useContract();

  const getContractAddress = async () => await getMarketplaceAddress();

  const getMarketContract = async () => {
    const address = await getMarketplaceAddress();
    return await getContract(address, MARKETPLACE_ABI);
  };

  const listItem = async (collection, tokenId, price, payToken) => {
    const marketContract = await getMarketContract();
    let ERC721contract = await getERC721Contract(collection);

    const isApproved = await ERC721contract.isApprovedForAll(
      wallet,
      marketContract.address
    );

    if (!isApproved) {
      await approvalForAllGasless(ERC721contract, marketContract.address, true);
      await sleep(5000);
    }

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    return await sendMetaTx(marketContract, provider, signer, {
      functionName: "listItem",
      args: [
        collection,
        tokenId,
        payToken.contractAddress,
        parseEther(price.toString()),
        ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000)),
      ],
    });
  };

  const buyItem = async (
    buyer,
    collection,
    tokenId,
    owner,
    price,
    payToken
  ) => {
    const marketContract = await getMarketContract();
    const tokenAddress = payToken.contractAddress;
    const erc20 = await getERC20Contract(tokenAddress);

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();
    price = parseEther(price.toString());
    const wftmBalance = await getWFTMBalance(wallet);

    if (wftmBalance.lt(price)) {
      await wrapFTM(true, wallet, price, wallet);
      await sleep(4000);
    }

    const allowance = await erc20.allowance(buyer, marketContract.address);

    if (allowance.lt(price)) {
      await sendMetaTx(erc20, provider, signer, {
        functionName: "approve",
        args: [marketContract.address, price],
      });
      await sleep(3000);
    }

    const ERC721contract = await getERC721Contract(collection);

    await sendMetaTx(marketContract, provider, signer, {
      functionName: "buyItem",
      args: [collection, tokenId, tokenAddress, owner],
    });
    await sleep(4000);

    const isApproved = await ERC721contract.isApprovedForAll(
      wallet,
      marketContract.address
    );

    if (!isApproved) {
      await approvalForAllGasless(ERC721contract, marketContract.address);
    }
  };

  const cancelListing = async (collection, tokenId) => {
    const marketContract = await getMarketContract();
    const ERC721contract = await getERC721Contract(collection);

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    return await sendMetaTx(marketContract, provider, signer, {
      functionName: "cancelListing",
      args: [ERC721contract.address, tokenId],
    });
  };

  const updateListing = async (collection, tokenId, price, payToken) => {
    const marketContract = await getMarketContract();

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    return await sendMetaTx(marketContract, provider, signer, {
      functionName: "updateListing",
      args: [
        collection,
        tokenId,
        payToken.contractAddress,
        parseEther(price.toString()),
      ],
    });
  };

  const getListingInfo = async (collection, tokenId, owner) => {
    const marketContract = await getMarketContract();

    const listingInfo = await marketContract.listings(
      collection,
      tokenId,
      owner
    );

    const formatted = {
      payToken: listingInfo[0],
      price: formatEther(listingInfo[1]),
    };

    return formatted;
  };

  const makeOffer = async (
    buyer,
    collection,
    tokenId,
    offerPrice,
    deadline,
    payToken
  ) => {
    const marketContract = await getMarketContract();
    const tokenAddress = payToken.contractAddress;

    const erc20 = await getERC20Contract(tokenAddress);

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    offerPrice = parseEther(offerPrice.toString());
    const wftmBalance = await getWFTMBalance(wallet);

    if (wftmBalance.lt(offerPrice)) {
      await wrapFTM(true, wallet, offerPrice, wallet);
      await sleep(4000);
    }

    let allowance = await erc20.allowance(buyer, marketContract.address);
    if (allowance.lt(offerPrice)) {
      await sendMetaTx(erc20, provider, signer, {
        functionName: "approve",
        args: [marketContract.address, offerPrice],
      });
      await sleep(5000);
    }

    await sendMetaTx(marketContract, provider, signer, {
      functionName: "createOffer",
      args: [
        collection,
        ethers.BigNumber.from(tokenId),
        tokenAddress,
        offerPrice,
        ethers.BigNumber.from(deadline),
      ],
    });
  };

  const modifyOrder = async (
    buyer,
    collection,
    tokenId,
    offerPrice,
    deadline,
    payToken
  ) => {
    const marketContract = await getMarketContract();
    const tokenAddress = payToken.contractAddress;
    const erc20 = await getERC20Contract(tokenAddress);

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();
    const allowance = await erc20.allowance(buyer, marketContract.address);
    if (allowance.lt(offerPrice)) {
      await sendMetaTx(erc20, provider, signer, {
        functionName: "approve",
        args: [marketContract.address, parseEther(offerPrice.toString())],
      });
      await sleep(3000);
    }

    return await sendMetaTx(marketContract, provider, signer, {
      functionName: "modifyOffer",
      args: [
        collection,
        ethers.BigNumber.from(tokenId),
        tokenAddress,
        parseEther(offerPrice.toString()),
        ethers.BigNumber.from(deadline),
      ],
    });
  };

  const acceptOffer = async (collection, tokenId, creator) => {
    const marketContract = await getMarketContract();
    const ERC721contract = await getERC721Contract(collection);

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    const isApproved = await ERC721contract.isApprovedForAll(
      wallet,
      marketContract.address
    );

    if (!isApproved) {
      await approvalForAllGasless(ERC721contract, marketContract.address);
      await sleep(4000);
    }

    await sendMetaTx(marketContract, provider, signer, {
      functionName: "acceptOffer",
      args: [collection, tokenId, creator],
    });
  };

  const cancelOffer = async (collection, tokenId, offerPrice) => {
    const marketContract = await getMarketContract();
    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    offerPrice = parseEther(offerPrice.toString());
    const wftmBalance = await getWFTMBalance(from);
    if (wftmBalance.gte(offerPrice)) {
      await unwrapFTMGassless(offerPrice);
      await sleep(2000);
    }

    return await sendMetaTx(marketContract, provider, signer, {
      functionName: "cancelOffer",
      args: [collection, tokenId],
    });
  };

  const getOffer = async (collection, tokenId, wallet) => {
    const marketContract = await getMarketContract();

    let offer = await marketContract.offers(collection, tokenId, wallet);

    return {
      payToken: offer.payToken,
      price: formatEther(offer.price),
      deadline: offer.deadline,
      creator: wallet,
    };
  };
  return {
    getContractAddress,
    getMarketContract,
    listItem,
    buyItem,
    cancelListing,
    updateListing,
    getListingInfo,
    makeOffer,
    cancelOffer,
    acceptOffer,
    getOffer,
    modifyOrder,
  };
};
