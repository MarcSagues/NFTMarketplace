import React, { useRef, useState } from "react";
import WrappedFTMModal from "./modals/WrappedFTMModal";
import { UserMenu } from "./UserMenu";
import { useStateContext } from "../context/StateProvider";

export default function WalletButton({
  userProfile,
  wallet,
  disconnectWallet,
  openModal,
}) {
  const [{ literals }] = useStateContext();
  const [openMenu, setOpenMenu] = useState(false);
  const walletButtonRef = useRef(null);
  const [openStation, setOpenStation] = useState(false);
  const showMenu = (e) => {
    setOpenMenu(!openMenu);
  };
  return (
    <div className="w-full">
      <button
        ref={walletButtonRef}
        onClick={!wallet ? openModal : showMenu}
        className=" hover:bg-gray-100 dark:hover:bg-gray-700  border border-gray-400 text-gray-600 dark:text-gray-400 rounded shadow w-[150px] md:w-[200px]"
      >
        {wallet !== "" ? (
          <div className="flex justify-evenly items-center py-1 px-2">
            <div>
              <img
                className="w-[32px] h-[32px] md:w-[48px] md:h-[48px] rounded-full"
                src={userProfile.profileImg}
                alt=""
              />
            </div>
            <div>
              <div className="text-sm dark:text-gray-200">
                <b>{userProfile.username}</b>
              </div>
              <div className="text-xs text-gray-400">
                {wallet?.substring(0, 6)}...
                {wallet?.substring(wallet.length - 4, wallet.length)}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-3 px-2">{literals.navbar.connectWallet}</div>
        )}
      </button>
      {openMenu && (
        <UserMenu
          buttonRef={walletButtonRef}
          wallet={wallet}
          setOpenMenu={setOpenMenu}
          setOpenStation={setOpenStation}
          disconnectWallet={disconnectWallet}
        />
      )}
      {openStation && (
        <WrappedFTMModal
          showModal={openStation}
          wallet={wallet}
          handleCloseModal={() => setOpenStation(false)}
        />
      )}
    </div>
  );
}
