import React, { useEffect, useRef, useState } from "react";
import useAccount from "../hooks/useAccount";
import { Icon } from "@iconify/react";
import logo from "../assets/logoNavbar.png";
import logoSmall from "../assets/logoNavbarSmall.png";
import { useLocation, useNavigate } from "react-router-dom";
import WalletButton from "./WalletButton";
import ConnectionModal from "./modals/ConnectionModal";
import { useStateContext } from "../context/StateProvider";
import useRespnsive from "../hooks/useResponsive";
import SearchResult from "./SearchResult";
import { useApi } from "../api";
import { NotificationsMenu } from "./NotificationsMenu";

export default function Navbar() {
  const { searchItemsAndProfiles, getUserNotifications, deleteNotification } =
    useApi();
  const [searchText, setSearchText] = useState("");
  const { wallet, connectToWallet, disconnectWallet } = useAccount();
  const [openModal, setOpenModal] = useState(false);
  const [openedMenu, setOpenedMenu] = useState(false);
  const [{ userProfile, verifiedAddress, literals }] = useStateContext();
  const [searchItemsData, setSearchItemsData] = useState([]);
  const [searchProfilesData, setSearchProfilesData] = useState([]);
  const [searchCollectionsData, setSearchCollectionsData] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  const [openSearchResult, setOpenSearchResult] = useState(false);

  const searchInputRef = useRef(null);

  const showNotificationsRef = useRef(null);
  const { _width } = useRespnsive();
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const navigate = useNavigate();
  const location = useLocation();

  const searchItems = async (queryText) => {
    setSearchText(queryText);
    if (queryText.length >= 4) {
      setOpenSearchResult(true);
      const res = await searchItemsAndProfiles(queryText);
      const { profiles, items, collections } = res;
      if (items.length === 0) {
        setSearchItemsData([
          {
            name: literals.navbar.noItem,
            image:
              "https://cdn2.iconfinder.com/data/icons/documents-and-files-v-2/100/doc-03-512.png",
          },
        ]);
      } else {
        setSearchItemsData(items);
      }

      if (profiles.length === 0) {
        setSearchProfilesData([
          {
            username: literals.navbar.noProfile,
            profileImg:
              "https://cdn2.iconfinder.com/data/icons/documents-and-files-v-2/100/doc-03-512.png",
          },
        ]);
      } else {
        setSearchProfilesData(profiles);
      }
      if (collections.length === 0) {
        setSearchCollectionsData([
          {
            name: literals.navbar.noCollections,
            logoImage:
              "https://cdn2.iconfinder.com/data/icons/documents-and-files-v-2/100/doc-03-512.png",
          },
        ]);
      } else {
        setSearchCollectionsData(collections);
      }
    } else {
      setSearchItemsData([]);
      setSearchProfilesData([]);
      setSearchCollectionsData([]);
    }
  };
  const gotoHomepage = () => {
    setOpenModal(false);
    navigate("/");
  };

  const openBurguer = () => {
    setOpenedMenu(true);
  };

  const closeBurguer = () => {
    setOpenedMenu(false);
  };

  const openNotifications = () => {
    setShowNotificationsMenu(!showNotificationsMenu);
  };

  const removeNotification = async (notificationId) => {
    await deleteNotification(notificationId);

    let filtered = notifications.filter((item) => item._id !== notificationId);
    setNotifications(filtered);
  };

  useEffect(() => {
    if (_width >= 1024) {
      setOpenedMenu(false);
    }
  }, [_width]);

  useEffect(() => {
    const fetchData = async () => {
      setOpenedMenu(false);
      if (wallet !== "") {
        const userNotifications = await getUserNotifications(wallet);
        setNotifications(userNotifications);
      }
    };
    fetchData();
  }, [location.pathname, wallet]);
  return (
    <header className="fixed top-0 w-full h-[81px] bg-gradient-to-r from-[#7E29F1] z-10 to-[#b9dafe] ">
      <div className="h-[79px] bg-white dark:bg-dark-1 flex flex-row justify-between w-full items-center px-2">
        <div className=" flex items-center cursor-pointer">
          <img
            src={_width < 775 ? logoSmall : logo}
            href="/"
            onClick={gotoHomepage}
            alt="FibboLogo"
            className="w-[64px] md:w-[128px] object-contain"
          ></img>
        </div>
        <div className="flex gap-5 items-center  ">
          <div className="hidden lg:flex  items-center p-0 m-0 align-baseline">
            <div>
              <div className="flex items-center justify-center">
                <div className="flex border-2 rounded">
                  <div className="flex items-center justify-center px-4 border-l">
                    <Icon icon="ant-design:search-outlined" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={`px-4 py-2 ${
                      _width < 1200 ? "w-[200px]" : "w-[350px]"
                    }  outline-none dark:bg-dark-1`}
                    placeholder={literals.navbar.searchItems}
                    onChange={(e) => searchItems(e.target.value)}
                    value={searchText}
                  />
                </div>
              </div>
              {openSearchResult &&
                (searchItemsData.length > 0 ||
                  searchProfilesData.length > 0) && (
                  <SearchResult
                    setInputValue={setSearchText}
                    setSearchResult={{
                      items: setSearchItemsData,
                      profiles: setSearchProfilesData,
                    }}
                    itemsResult={searchItemsData}
                    profilesResult={searchProfilesData}
                    collectionsResult={searchCollectionsData}
                    setOpenSearchResult={setOpenSearchResult}
                  />
                )}
            </div>
            <div className="flex ">
              <NavbarItem text="Marketplace" to="/explore" />

              <NavbarItem
                text={literals.navbar.collections}
                to="/collections"
              />

              {/*   {!verifiedAddress && (
                <NavbarItem
                  text={literals.navbar.verify}
                  to="/verificate/request"
                />
              )} */}

              {/* {verifiedAddress && (
                <NavbarItem text="Comunidad" to="/community" />
              )} */}
              {/* {verifiedAddress && <NavbarItem text="Creación" to="/create" />} */}
            </div>
          </div>
          <div className=" gap-5 flex flex-row justify-between items-center ">
            {wallet !== "" && (
              <div className="flex flex-col  cursor-pointer">
                <div
                  className="flex"
                  ref={showNotificationsRef}
                  onClick={() => openNotifications()}
                >
                  <Icon
                    className="text-3xl text-gray-600 dark:text-gray-300"
                    icon="ic:baseline-notifications"
                    width={32}
                  />
                  <div className="rounded-lg absolute text-white w-4 h-4 bg-red-400 text-xs flex items-center justify-center">
                    {notifications.length}
                  </div>
                </div>
                {showNotificationsMenu && (
                  <NotificationsMenu
                    notifications={notifications}
                    buttonRef={showNotificationsRef}
                    setOpenMenu={setShowNotificationsMenu}
                    removeNotification={removeNotification}
                  />
                )}
              </div>
            )}
            <WalletButton
              userProfile={userProfile}
              openModal={handleOpenModal}
              wallet={wallet}
              connectToWallet={connectToWallet}
              disconnectWallet={disconnectWallet}
            />

            <div className="flex">
              <div id="iconOpenBurguer" className="lg:hidden flex w-auto">
                {!openedMenu ? (
                  <Icon
                    className="text-3xl text-gray-600 dark:text-gray-300 cursor-pointer"
                    onClick={() => openBurguer()}
                    icon="bx:menu-alt-left"
                  />
                ) : (
                  <Icon
                    className="text-3xl text-gray-600 dark:text-gray-300  cursor-pointer "
                    onClick={() => closeBurguer()}
                    icon="bx:menu-alt-right"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <ConnectionModal
          showModal={openModal}
          handleCloseModal={() => setOpenModal(false)}
          connectToWallet={connectToWallet}
        />
        {openedMenu && (
          <div
            id="burguerContentMobile"
            className="bg-white dark:bg-dark-1 absolute flex  w-screen h-screen top-20 left-0"
          >
            <div className="flex flex-col gap-10 mt-10 w-full">
              <div className=" flex items-center justify-center">
                <div className="flex border-2 rounded">
                  <div className="dark:bg-dark-1">
                    <div className="flex items-center justify-center dark:bg-dark-1">
                      <div className="flex border-2 rounded">
                        <div className="flex items-center justify-center px-4 border-l">
                          <Icon icon="ant-design:search-outlined" />
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          className={` px-4 py-2 ${
                            _width < 1200 ? "w-[200px]" : "w-[350px]"
                          } outline-none dark:bg-dark-1`}
                          placeholder={literals.navbar.searchItems}
                          onChange={(e) => searchItems(e.target.value)}
                          value={searchText}
                        />
                      </div>
                    </div>
                    {openSearchResult &&
                      (searchItemsData.length > 0 ||
                        searchProfilesData.length > 0) && (
                        <SearchResult
                          setInputValue={setSearchText}
                          setSearchResult={{
                            items: setSearchItemsData,
                            profiles: setSearchProfilesData,
                          }}
                          itemsResult={searchItemsData}
                          profilesResult={searchProfilesData}
                          collectionsResult={searchCollectionsData}
                          setOpenSearchResult={setOpenSearchResult}
                        />
                      )}
                  </div>
                </div>
              </div>
              <NavbarItemMobile text="Marketplace" to="/explore" />
              {verifiedAddress && (
                <NavbarItemMobile
                  text={literals.navbar.collections}
                  to="/collections"
                />
              )}
              {/* {!verifiedAddress && (
                <NavbarItemMobile
                  text={literals.navbar.verify}
                  to="/verificate/request"
                />
              )} */}
              {/*  {verifiedAddress && (
                <NavbarItemMobile text="Comunidad" to="/community" />
              )} */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

const NavbarItem = ({ text, to }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div
      onClick={() => navigate(to)}
      className={` ml-5  hover:font-bold cursor-pointer dark:text-primary-2 ${
        location.pathname === to
          ? "text-primary-1 font-bold border-b-2 border-[#733ADA]"
          : "text-primary-1 dark:text-primary-2 "
      } `}
    >
      {text}
    </div>
  );
};

const NavbarItemMobile = ({ text, to }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div
      className="flex items-center justify-center"
      onClick={() => navigate(to)}
    >
      <p
        className={` ml-5 hover:text-blue-400 hover:font-bold ${
          location.pathname === to
            ? "text-primary-b font-bold"
            : "text-primary-1 "
        } hover:text-primary-3 dark:text-primary-4 `}
      >
        {text}
      </p>
    </div>
  );
};
