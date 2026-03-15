import { Icon } from "@iconify/react";
import React from "react";
import { isMobile } from "react-device-detect";
import { useStateContext } from "../../context/StateProvider";
import { BasicModal } from "./BasicModal";

export default function ConnectionModal({
  children,
  showModal,
  handleCloseModal,
  connectToWallet,
}) {
  const [{ literals }] = useStateContext();
  const connectToMetamask = async () => {
    await connectToWallet();
    handleCloseModal();
  };
  const redirectToMetamaskApp = async () => {
    window.location = `https://metamask.app.link/dapp/${window.location.href}`;
  };

  const metamaskConnect = async () => {
    if (window.ethereum) {
      await connectToMetamask();
    } else if (!isMobile && !window.ethereum) {
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=es",
        "_blank"
      );
    } else {
      redirectToMetamaskApp();
    }
  };
  return (
    <BasicModal
      title={literals.modals.connectSentence}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
    >
      <div className="my-10 mx-3 md:mx-8 flex flex-col gap-10">
        <button
          onClick={() => metamaskConnect()}
          className="flex w-full gap-5 justify-between bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 hover:dark:bg-gray-600 items-center hover:bg-gray-300 p-5 border-2 shadow-lg rounded-xl"
        >
          <div>{literals.modals.connectMetamask}</div>
          <div>
            <Icon className="text-3xl" icon="logos:metamask-icon" />
          </div>
        </button>
      </div>
    </BasicModal>
  );
}
