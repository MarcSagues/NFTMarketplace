import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";

// eslint-disable-next-line no-undef
const isMainnet = false;

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const getWalletBalance = async (wallet) => {
    const provider = new ethers.providers.JsonRpcProvider(
      isMainnet
        ? "https://rpc.ftm.tools/"
        : "https://rpc.testnet.fantom.network/",
      isMainnet ? 250 : 4002
    );
    const walletBalance = await provider.getBalance(wallet);

    return formatEther(walletBalance);
  };

  const createProvider = () => {
    return new ethers.providers.JsonRpcProvider(
      isMainnet
        ? "https://rpc.ftm.tools/"
        : "https://rpc.testnet.fantom.network/",
      isMainnet ? 250 : 4002
    );
  };

  return { getWalletBalance, createProvider };
};
