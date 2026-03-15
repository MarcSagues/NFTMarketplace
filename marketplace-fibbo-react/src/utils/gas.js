import { ethers } from "ethers";

export const getHigherGWEI = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const price = (await provider.getGasPrice()) * 2;

  return price;
};

export const calculateGasMargin = (value) => {
  return value
    .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
    .div(ethers.BigNumber.from(10000));
};
