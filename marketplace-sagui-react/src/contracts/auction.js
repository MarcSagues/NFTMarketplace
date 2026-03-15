import { ethers } from "ethers";
import { ChainId } from "@sushiswap/sdk";
import useContract from "../hooks/useContract";
import { AUCTION_ABI } from "./abi";
import { useAddressRegistry } from "./addressRegistry";
import { Contracts } from "../constants/networks";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useTokens } from "./token";
import { useFactory } from "./factory";

import useProvider from "../hooks/useProvider";
import { sendMetaTx } from "./meta";
import { useWFTMContract } from "./wftm";

const CHAIN = ChainId.FANTOM_TESTNET;
const WFTM_ADDRESS = Contracts[CHAIN].wftmAddress;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatAuction = (auctionData) => {
  return {
    owner: auctionData.owner,
    reservePrice: formatEther(auctionData.reservePrice),
    buyNowPrice: formatEther(auctionData.buyNowPrice),
    payToken: auctionData.payToken,
    startTime: auctionData.startTime.toNumber(),
    endTime: auctionData.endTime.toNumber(),
    minBid: formatEther(auctionData.minBid),
  };
};

const formatHighestBid = (highestBidData) => {
  return {
    bid: parseFloat(formatEther(highestBidData.bid)),
    bidder: highestBidData.bidder,
  };
};

export const useAuction = () => {
  const { getERC20Contract, getERC721Contract, approvalForAllGasless } =
    useTokens();
  const { getAuctionAddress } = useAddressRegistry();
  const { createProvider } = useProvider();
  const { getContract } = useContract();
  const { getFactoryContract } = useFactory();
  const { getWFTMBalance, wrapFTM } = useWFTMContract();

  const getContractAddress = async () => await getAuctionAddress();

  const getAuctionContract = async () => {
    const address = await getAuctionAddress();
    return await getContract(address, AUCTION_ABI);
  };

  const getAuction = async (collection, tokenId) => {
    const auctionContract = await getAuctionContract();

    let auction = await auctionContract.auctions(
      collection,
      ethers.BigNumber.from(tokenId)
    );

    return formatAuction(auction);
  };

  const getHighestBid = async (collection, tokenId) => {
    const auctionContract = await getAuctionContract();

    let highestBid = await auctionContract.highestBids(
      collection,
      ethers.BigNumber.from(tokenId)
    );

    return formatHighestBid(highestBid);
  };

  const createAuction = async (
    wallet,
    collection,
    tokenId,
    reservePrice,
    buyNowPrice,
    minBidReserve,
    startTime,
    endTime,
    payToken
  ) => {
    const auctionContract = await getAuctionContract();

    const ERC721contract = await getERC721Contract(collection);
    const factoryContract = await getFactoryContract();
    const isApprovedForAll = await ERC721contract.isApprovedForAll(
      wallet,
      auctionContract.address
    );
    if (!isApprovedForAll) {
      await approvalForAllGasless(ERC721contract, auctionContract.address);
      await sleep(5000);
    }

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    return await sendMetaTx(auctionContract, provider, signer, {
      functionName: "createAuction",
      args: [
        collection,
        ethers.BigNumber.from(tokenId),
        payToken.contractAddress,
        parseEther(reservePrice.toString()),
        parseEther(buyNowPrice.toString()),
        ethers.BigNumber.from(startTime),
        minBidReserve,
        ethers.BigNumber.from(endTime),
      ],
    });
  };

  const updateReservePrice = async (collection, tokenId, reservePrice) => {
    const auctionContract = await getAuctionContract();

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    await sendMetaTx(auctionContract, provider, signer, {
      functionName: "updateAuctionReservePrice",
      args: [collection, tokenId, parseEther(reservePrice.toString())],
    });
    await sleep(3000);
  };

  const updateStartTime = async (collection, tokenId, startTime) => {
    const auctionContract = await getAuctionContract();

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    await sendMetaTx(auctionContract, provider, signer, {
      functionName: "updateAuctionStartTime",
      args: [collection, tokenId, ethers.BigNumber.from(startTime)],
    });
    sleep(3000);
  };

  const updateEndTime = async (collection, tokenId, endTime) => {
    const auctionContract = await getAuctionContract();

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    await sendMetaTx(auctionContract, provider, signer, {
      functionName: "updateAuctionEndTime",
      args: [collection, tokenId, ethers.BigNumber.from(endTime)],
    });

    sleep(3000);
  };

  const cancelAuction = async (collection, tokenId) => {
    const auctionContract = await getAuctionContract();

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    return await sendMetaTx(auctionContract, provider, signer, {
      functionName: "cancelAuction",
      args: [collection, tokenId],
    });
  };

  const makeBid = async (bidder, collection, tokenId, bidAmount) => {
    try {
      const auctionContract = await getAuctionContract();
      const erc20 = await getERC20Contract(WFTM_ADDRESS);

      const provider = createProvider();
      await window.ethereum.enable();
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = userProvider.getSigner();
      const from = await signer.getAddress();

      bidAmount = parseEther(bidAmount.toString());
      const wftmBalance = await getWFTMBalance(bidder);

      if (wftmBalance.lt(bidAmount)) {
        await wrapFTM(true, bidder, bidAmount, bidder);
        await sleep(2000);
      }

      const allowance = await erc20.allowance(bidder, auctionContract.address);

      if (allowance.lt(bidAmount)) {
        await sendMetaTx(erc20, provider, signer, {
          functionName: "approve",
          args: [auctionContract.address, bidAmount],
        });

        await sleep(3000);
      }

      await sendMetaTx(auctionContract, provider, signer, {
        functionName: "placeBid",
        args: [collection, tokenId, bidAmount],
      });
      await sleep(7000);
    } catch (e) {
      console.log(e);
    }
  };

  const buyNow = async (buyer, collection, tokenId, buyNowPrice) => {
    try {
      const auctionContract = await getAuctionContract();
      const erc20 = await getERC20Contract(WFTM_ADDRESS);
      const ERC721contract = await getERC721Contract(collection);

      const provider = createProvider();
      await window.ethereum.enable();
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = userProvider.getSigner();
      const from = await signer.getAddress();

      const formattedPrice = parseEther(buyNowPrice.toString());

      const wftmBalance = await getWFTMBalance(buyer);

      if (wftmBalance.lt(formattedPrice)) {
        await wrapFTM(true, buyer, formattedPrice, buyer);
        await sleep(2000);
      }

      const allowance = await erc20.allowance(buyer, auctionContract.address);

      if (allowance.lt(formattedPrice)) {
        await sendMetaTx(erc20, provider, signer, {
          functionName: "approve",
          args: [auctionContract.address, formattedPrice],
        });

        await sleep(3000);
      }

      const isApprovedForAll = await ERC721contract.isApprovedForAll(
        buyer,
        auctionContract.address
      );

      if (!isApprovedForAll) {
        await approvalForAllGasless(ERC721contract, auctionContract.address);
        await sleep(4000);
      }

      return await sendMetaTx(auctionContract, provider, signer, {
        functionName: "buyNow",
        args: [collection, tokenId],
      });
    } catch (e) {
      console.log(e);
    }
  };

  return {
    getContractAddress,
    getAuctionContract,
    getAuction,
    createAuction,
    getHighestBid,
    makeBid,
    cancelAuction,
    updateEndTime,
    updateReservePrice,
    updateStartTime,
    buyNow,
  };
};
