import { changeChainCorrect } from "../utils/chain";
import { isMobile, isBrowser } from "react-device-detect";
let currentAccount = null;

export default function useChain(loadingConnection) {
  const handleAccountsChanged = (accounts) => {
    if (window.ethereum) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
      } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        window.location.reload();
        // Do any other work!
      }
    }
  };
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    const handleChainChanged = async (_chainId) => {
      // We recommend reloading the page, unless you must do otherwise
      await changeChainCorrect();
      window.location.reload();
    };

    window.ethereum.on("chainChanged", handleChainChanged);
  }
}
