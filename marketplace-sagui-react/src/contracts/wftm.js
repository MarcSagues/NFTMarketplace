import { ChainId } from "@sushiswap/sdk";

import { WFTM_ABI } from "./abi";
import { calculateGasMargin, getHigherGWEI } from "../utils/gas";
import useContract from "../hooks/useContract";
import { Contract, ethers } from "ethers";
import { useMarketplace } from "./market";
import { useApi } from "../api";
import { useAuction } from "./auction";
import useProvider from "../hooks/useProvider";
import { sendMetaTx } from "./meta";
import { Contracts } from "../constants/networks";
import { formatEther } from "ethers/lib/utils";

const tokenSymbol = "FTM";
const tokenDecimals = 18;
const tokenImage =
  "https://cdn.sanity.io/images/lmw8etck/dev-cdn/7d85bd9e849d164e634a3d72c9ee679be6370559-128x128.png";

// eslint-disable-next-line no-undef
const isMainnet = false;

const CHAIN = isMainnet ? ChainId.FANTOM : ChainId.FANTOM_TESTNET;
export const useWFTMContract = () => {
  const { getContract } = useContract();
  const { setImportWFTM } = useApi();

  const { createProvider, getWalletBalance } = useProvider();

  const wftmAddress = Contracts[CHAIN].wftmAddress;

  const getWFTMContract = async () => await getContract(wftmAddress, WFTM_ABI);

  const getWFTMBalance = async (address) => {
    const contract = await getWFTMContract();
    return await contract.balanceOf(address);
  };

  const getTotalFTMBalance = async (address) => {
    const wftBalance = formatEther(await getWFTMBalance(address));
    const ftmBalance = await getWalletBalance(address);
    let result = parseFloat(wftBalance) + parseFloat(ftmBalance);
    return result;
  };

  const importWFTM = async (wallet) => {
    const success = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: wftmAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });
    if (success) await setImportWFTM(wallet);
  };

  const unwrapFTMGassless = async (value) => {
    //if (!isImported) await importWFTM(wallet);
    const contract = await getWFTMContract();

    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    const from = await signer.getAddress();

    return await sendMetaTx(contract, provider, signer, {
      functionName: "withdraw",
      args: [value],
    });
  };

  const wrapFTM = async (isImported, wallet, value, from) => {
    if (!isImported) await importWFTM(wallet);
    const contract = await getWFTMContract();

    const options = {
      value,
      from,
      gasPrice: getHigherGWEI(),
    };

    const gasEstimate = await contract.estimateGas.deposit(options);
    options.gasLimit = calculateGasMargin(gasEstimate);

    let tx = await contract.deposit(options);
    tx.wait();
  };

  const unwrapFTM = async (value) => {
    const contract = await getWFTMContract();

    const options = {
      gasPrice: getHigherGWEI(),
    };

    return await contract.withdraw(value, options);
  };

  const getAllowance = async (owner, spender) => {
    const contract = await getWFTMContract();
    return await contract.allowance(owner, spender);
  };

  const approve = async (address, value) => {
    const contract = await getWFTMContract();
    const provider = createProvider();
    await window.ethereum.enable();
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = userProvider.getSigner();
    return await sendMetaTx(contract, provider, signer, {
      functionName: "approve",
      args: [address, value],
    });
  };

  return {
    wftmAddress,
    getWFTMBalance,
    wrapFTM,
    unwrapFTMGassless,
    unwrapFTM,
    getAllowance,
    approve,
    getTotalFTMBalance,
  };
};
