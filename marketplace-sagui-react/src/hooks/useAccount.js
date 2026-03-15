import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useStateContext } from "../context/StateProvider";
import { actionTypes } from "../context/stateReducer";
import { configData } from "../chainData/configData";
import { changeChainCorrect } from "../utils/chain";
import { useApi } from "../api";
import { useVerification } from "../contracts/verification";
import { isMobile, isChrome, isSafari } from "react-device-detect";

export default function useAccount() {
  const [loadingConnection, setLoadingConection] = useState(true);
  const { getProfileInfo, createNewProfile } = useApi();
  const [{ wallet, userProfile }, stateDispatch] = useStateContext();
  const { checkWalletVerified } = useVerification();
  const connectToWallet = useCallback(async () => {
    const prov = new ethers.providers.Web3Provider(window.ethereum);

    await prov.send("eth_requestAccounts", []);

    const signer = prov.getSigner();

    const _wallet = await signer.getAddress();

    let chainId = await signer.getChainId();

    //Una vez tenemos wallet, creamos o recogemos user en sanity
    let correctChain = true;
    if (chainId !== configData.chainInfo.chainId) {
      console.log("change to ftm testnet");
      correctChain = false;
    }
    if (!correctChain) {
      await changeChainCorrect();
    }
    const userProfileRequest = await getProfileInfo(_wallet);
    const isVerifiedAddress = await checkWalletVerified(_wallet);
    if (userProfileRequest) {
      stateDispatch({
        type: actionTypes.SET_USER_PROFILE,
        userProfile: userProfileRequest,
        wallet: _wallet,
        verifiedAddress: isVerifiedAddress,
      });
    } else {
      //Create profile
      const createdProfile = await createNewProfile(_wallet);
      stateDispatch({
        type: actionTypes.SET_USER_PROFILE,
        userProfile: createdProfile,
        wallet: _wallet,
        verifiedAddress: isVerifiedAddress,
      });
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    stateDispatch({
      type: actionTypes.SET_USER_PROFILE,
      userProfile: {},
      wallet: "",
      verifiedAddress: false,
    });
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      if (userProfile.wallet && wallet) {
      } else {
        if (!window.ethereum.isConnected()) {
          connectToWallet().then((res) => {});
        }
      }
    }

    return () => {
      return;
    };
  }, [connectToWallet]);

  return {
    wallet,
    loadingConnection,
    connectToWallet,
    disconnectWallet,
  };
}
