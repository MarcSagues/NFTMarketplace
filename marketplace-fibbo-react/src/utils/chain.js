import { configData } from "../chainData/configData";

export const changeChainCorrect = async () => {
  let { chainId, name, rpcUrl, coinCurrency, coinIcon } = configData.chainInfo;
  chainId = "0x" + chainId.toString(16);

  //Comprobar si esta creada MUMBAI

  //SI no ho esta fer wallet_addEthereumChain

  const created = await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: chainId,
        chainName: name,
        nativeCurrency: {
          name: name,
          symbol: coinCurrency, // 2-6 characters long
          decimals: 18,
        },
        rpcUrls: [rpcUrl],
      },
    ],
  });
  if (created) {
  } else {
  }
};
