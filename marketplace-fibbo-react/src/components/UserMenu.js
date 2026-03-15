import { Icon } from "@iconify/react";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateProvider";
import { ThemeContext } from "../context/ThemeContext";

export const UserMenu = ({
  setOpenStation,
  setOpenMenu,
  wallet,
  disconnectWallet,
  buttonRef,
}) => {
  const ref = useRef(null);
  const { theme, setTheme } = React.useContext(ThemeContext);
  const [{ verifiedAddress, userProfile, literals }] = useStateContext();

  const navigate = useNavigate();
  const goToProfile = () => {
    setOpenMenu(false);
    navigate(`/account/${userProfile.wallet}`);
  };

  const goToCommunity = () => {
    setOpenMenu(false);
    navigate(`/community`);
  };

  const goToSettings = () => {
    setOpenMenu(false);
    navigate(`/account/settings/profile`);
  };

  const goToMyCollections = () => {
    setOpenMenu(false);
    navigate(`/myCollections`);
  };

  const handleDisconnect = () => {
    setOpenMenu(false);
    disconnectWallet();
  };

  const openTransak = () => {
    const baseUrl = `https://staging-global.transak.com/?apiKey=e486f33d-d0db-431b-bcf7-852e42ed9fdc&&cryptoCurrencyList=FTM&defaultCryptoCurrency=FTM,&disableWalletAddressForm=true&walletAddress=${wallet}&exchangeScreenTitle=Buy%20FTM%20for%20FIBBO%20Marketplace&isFeeCalculationHidden=true&redirectURL=${window.location.href}`;
    window.open(baseUrl, "_blank");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <>
      <div
        ref={ref}
        className="w-[175px] md:w-[225px] bg-gray-100 dark:bg-dark-2 absolute  z-20 flex flex-col  rounded-md"
      >
        <UserMenuItem
          text={literals.userMenu.profile}
          icon="healthicons:ui-user-profile"
          onClick={() => goToProfile()}
        />
        {verifiedAddress && (
          <UserMenuItem
            text={literals.userMenu.myCollections}
            icon="bi:box-seam-fill"
            onClick={() => goToMyCollections()}
          />
        )}

        <UserMenuItem
          text={literals.userMenu.community}
          icon="fluent:people-community-16-filled"
          onClick={() => goToCommunity()}
        />
        {/*     <UserMenuItem
          text={literals.userMenu.station}
          icon="carbon:gas-station-filled"
          onClick={() => setOpenStation(true)}
        /> */}
        <UserMenuItem
          text={literals.userMenu.buyFTM}
          icon="fa6-solid:money-bill-transfer"
          onClick={() => openTransak()}
        />
        <UserMenuItem
          text={literals.userMenu.settings}
          icon="ci:settings"
          onClick={() => goToSettings()}
        />
        <UserMenuItem
          text={literals.userMenu.disconnect}
          icon="ri:logout-box-line"
          onClick={handleDisconnect}
        />

        <UserMenuItemToggle
          text={literals.userMenu.darkMode}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </div>
    </>
  );
};

const UserMenuItem = ({ text, icon, disabled, onClick }) => {
  return (
    <div
      onClick={disabled ? null : onClick}
      className={`p-2 ${
        disabled
          ? "cursor-not-allowed text-gray-400"
          : "cursor-pointer hover:bg-gray-300"
      }  flex items-center gap-5`}
    >
      <Icon icon={icon} width={32} />
      {text}
    </div>
  );
};

const UserMenuItemToggle = ({ text, disabled, onClick }) => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <div
      onClick={disabled ? null : onClick}
      className={`p-2 ${
        disabled
          ? "cursor-not-allowed text-gray-400"
          : "cursor-pointer hover:bg-gray-300"
      }  flex items-center gap-5`}
    >
      <div className="flex p-2 items-center dark:justify-end w-[64px] h-[32px] bg-gray-400 dark:bg-primary-2 rounded-xl">
        {theme === "dark" ? (
          <Icon width={24} icon="fa-solid:moon" className="text-gray-200" />
        ) : (
          <Icon width={28} icon="fa-solid:sun" className="text-gray-700" />
        )}
      </div>
      {text}
    </div>
  );
};
