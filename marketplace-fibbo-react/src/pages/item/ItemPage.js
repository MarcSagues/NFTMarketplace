import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { configData } from "../../chainData/configData";
import useAccount from "../../hooks/useAccount";
import ReactTooltip from "react-tooltip";

import ItemHistory from "../../components/ItemHistory";
import DetailImage from "./components/DetailImage";
import DetailInfo from "./components/DetailInfo";
import { useApi } from "../../api";
import { useMarketplace } from "../../contracts/market";
import fibboLogo from "../../assets/logoNavbarSmall.png";
import { useAuction } from "../../contracts/auction";
import PutForSaleModal from "../../components/modals/PutForSaleModal";
import CreateAuctionModal from "../../components/modals/CreateAuctionModal";
import BuyItemModal from "../../components/modals/BuyItemModal";
import MakeOfferModal from "../../components/modals/MakeOfferModal";
import RemoveOfferModal from "../../components/modals/RemoveOfferModal";
import MakeBidModal from "../../components/modals/NewBidModal";
import BuyNowModal from "../../components/modals/BuyNowModal";
import CancelAuctionModal from "../../components/modals/CancelAuctionModal";
import UpdateAuctionModal from "../../components/modals/UpdateAuctionModal";
import ChangePriceModal from "../../components/modals/ChangePriceModal";
import UnlistItemModal from "../../components/modals/UnlistItemModal";
import ConnectionModal from "../../components/modals/ConnectionModal";

import AdditionalContentModal from "../../components/modals/AdditionalContentModal";
import ActionButton from "../../components/ActionButton";
import { ItemDirectOffers } from "../../components/ItemDirectOffers";
import { truncateWallet } from "../../utils/wallet";
import { Icon } from "@iconify/react";
import CoinGecko from "coingecko-api";
import { isMobile } from "react-device-detect";
import { useTokens } from "../../contracts/token";
import { MoreItems } from "../../components/MoreItems";
import { useCollections } from "../../contracts/collection";
import { ThemeContext } from "../../context/ThemeContext";
import useResponsive from "../../hooks/useResponsive";
import { useStateContext } from "../../context/StateProvider";
import { actionTypes } from "../../context/stateReducer";
import RedirectModal from "../../components/modals/RedirectModal";
import ModifyOfferModal from "../../components/modals/ModifyOfferModal";
import TransferModal from "../../components/modals/TransferModal";
import DeleteItemModal from "../../components/modals/DeleteItemModal";
import { formatLiteral } from "../../utils/language";
import { ButtonTooltip } from "../../components/tooltips/ButtonTooltip";
import ReportModal from "../../components/modals/ReportModal";

const formatPriceInUsd = (price) => {
  let priceStr = price.toString().split(".");
  let finalPrice = `${priceStr[0]},${priceStr[1]}`;
  return finalPrice;
};

export default function ItemPage() {
  const navigate = useNavigate();
  const { _width } = useResponsive();
  const [{ lang, userProfile, literals }, dispatch] = useStateContext();
  let { collection, tokenId } = useParams();
  const { wallet, connectToWallet } = useAccount();
  const {
    getProfileInfo,
    getNftInfo,
    getNftHistory,
    getCollectionDetail,
    getPayTokenInfo,
    getCollectionInfo,
    setShowRedirectProfile,
    setAcceptedOffer,
    deleteNftItem,
    registerSentItem,
    deleteFavorite,
    addFavorite,
  } = useApi();
  const {
    getListingInfo,
    listItem,
    cancelListing,
    getMarketContract,
    updateListing,
    makeOffer,
    getOffer,
    cancelOffer,
    buyItem,
    acceptOffer,
    modifyOrder,
  } = useMarketplace();
  const { getERC721Contract, sendItemGassles, burnItemGassles } = useTokens();

  const {
    getAuction,
    getHighestBid,
    createAuction,
    cancelAuction,
    updateStartTime,
    updateReservePrice,
    updateEndTime,
    makeBid,
    buyNow,
  } = useAuction();

  const [openConnectionModal, setOpenConnectionModal] = useState(false);
  const [openSellModal, setOpenSellModal] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [openChangePriceModal, setOpenChangePriceModal] = useState(false);
  const [openUnlistItemModal, setOpenUnlistItemModal] = useState(false);
  const [openAdditionalModal, setOpenAdditionalModal] = useState(false);
  const [openCancelOfferModal, setOpenCancelOfferModal] = useState(false);
  const [openModifyOfferModal, setOpenModifyOfferModal] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [openCreateAuction, setOpenCreateAuction] = useState(false);
  const [openBidModal, setOpenBidModal] = useState(false);
  const [openCancelAuctionModal, setOpenCancelAuctionModal] = useState(false);
  const [openUpdateAuctionModal, setOpenUpdateAuctionModal] = useState(false);
  const [openBuyNowModal, setOpenBuyNowModal] = useState(false);
  const [isHighestBidder, setIsHighestBidder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [moreItems, setMoreItems] = useState([]);
  const [coinPrice, setCoinPrice] = useState(1.2);
  const [myOffer, setMyOffer] = useState(null);
  const [chainInfo, setChainInfo] = useState({});
  const [properties, setProperties] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [isForSale, setIsForSale] = useState(false);
  const [isOnAuction, setIsOnAuction] = useState(false);
  const [highestBid, setHighestBid] = useState(null);
  const [actionMade, setActionMade] = useState(0);
  const [isCreator, setIsCreator] = useState(false);
  const [isFreezedMetadata, setIsFreezedMetadata] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [categories, setCategories] = useState([]);

  const [refreshMetadata, setRefreshMetadata] = useState(false);

  const tokenInfo = useRef({});
  const profileOwnerData = useRef({});
  const tokenHistoryInfo = useRef([]);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const offers = useRef([]);
  const listing = useRef(null);
  const auctionInfo = useRef(null);

  const top = useRef(null);

  const formatDate = (datetime) => {
    const nowTimestamp = Math.floor(new Date().getTime() / 1000);
    const period = datetime - nowTimestamp;

    const days = Math.round(period / 3600 / 24);
    if (days === 0) {
      const hours = Math.round(period / 3600);
      if (hours === 0) {
        const minutes = Math.round(period / 60);
        return `${minutes} ${
          minutes > 1 ? literals.detailNFT.minutes : literals.detailNFT.minute
        }`;
      } else {
        return `${hours} ${
          hours > 1 ? literals.detailNFT.hours : literals.detailNFT.hour
        }`;
      }
    } else {
      return `${days} ${
        days > 1 ? literals.detailNFT.days : literals.detailNFT.day
      }`;
    }
  };

  const auctionStarted =
    new Date().getTime() / 1000 >= auctionInfo?.current?.startTime;

  const redirectToProfile = () => {
    navigate(`/account/${profileOwnerData.current.wallet}`);
  };

  const redirectToCollecion = () => {
    let collectionURL = "";
    if (collectionInfo.customURL) {
      collectionURL = collectionInfo.customURL;
    } else {
      collectionURL = collectionInfo.contractAddress;
    }

    if (isMobile) {
      navigate(`/collection/${collectionURL}`);
    } else {
      window.open(`/collection/${collectionURL}`);
    }
  };

  const goToEdit = () => {
    navigate(
      `/edit/${
        collectionInfo.customURL ? collectionInfo.customURL : collection
      }/${tokenId}`
    );
  };

  const handleSaveRedirect = async () => {
    await setShowRedirectProfile(wallet);
    dispatch({
      type: actionTypes.UPDATED_NOT_SHOW,
    });
  };

  const goToExternalLink = () => {
    if (!userProfile.notShowRedirect) {
      setShowRedirect(true);
    } else {
      window.open(tokenInfo.current.externalLink, "_blank");
    }
  };

  const getItemDetails = async () => {
    const {
      nftData,
      offers: _offers,
      history,
      listing: _listing,
      favorites,
      isFavorited,
      categories,
    } = await getNftInfo(collection, tokenId, wallet);

    setCategories(categories);
    tokenInfo.current = nftData;
    tokenHistoryInfo.current = history;

    offers.current = _offers.sort((a, b) => {
      if (a.price > b.price) {
        return -1;
      } else {
        return 1;
      }
    });

    setIsCreator(wallet === nftData.creator);
    const collectionResponse = await getCollectionDetail(collection, wallet);
    setCollectionInfo(collectionResponse);

    setMoreItems(
      collectionResponse.nfts.filter(
        (item) => item.tokenId !== parseFloat(tokenId)
      )
    );
    const contract = await getERC721Contract(
      collectionResponse.contractAddress
    );
    console.log(collectionResponse);
    if (window.ethereum) {
      const isFreezed = await contract.isFreezedMetadata(tokenId);
      setIsFreezedMetadata(isFreezed);
    } else {
      setIsFreezedMetadata(nftData.hasFreezedMetadata);
    }

    setIsOwner(nftData.owner === wallet);

    if (_listing) {
      setIsForSale(true);

      listing.current = _listing;
    } else {
      setIsForSale(false);
      listing.current = _listing;
    }
    const profileOwnerResponse = await getProfileInfo(nftData.owner);

    profileOwnerData.current = profileOwnerResponse;

    setChainInfo({
      collection: collectionResponse.contractAddress,
      tokenId: tokenId,
      network: configData.chainInfo.name,
      chainId: configData.chainInfo.chainId,
    });

    const recipientInfo = await getProfileInfo(nftData.creator);

    let numberOfTokens = 0;
    if (window.ethereum) {
      numberOfTokens = await contract.getCurrentTokenID();
      numberOfTokens = numberOfTokens.toNumber();
    } else {
      numberOfTokens = collectionResponse.numberOfItems;
    }

    setProperties({
      royalty: nftData.royalty,
      recipient: recipientInfo,
      collection: collectionResponse,
      totalItems: numberOfTokens,
    });

    setIsLiked(isFavorited);
    setLikes(favorites);
  };

  const getAuctions = async () => {
    const collectionInfo = await getCollectionInfo(collection);
    try {
      const _auction = await getAuction(
        collectionInfo.contractAddress,
        tokenId
      );

      if (_auction.endTime !== 0) {
        setIsOnAuction(true);
        const payTokenInfo = await getPayTokenInfo(_auction.payToken);
        auctionInfo.current = {
          ..._auction,
          payToken: payTokenInfo,
        };
      } else {
        setIsOnAuction(false);
        auctionInfo.current = null;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getBid = async () => {
    try {
      const _collection = await getCollectionInfo(collection);
      if (auctionInfo.current) {
        const bid = await getHighestBid(
          _collection.contractAddress,
          tokenId,
          auctionInfo.current.payToken
        );

        if (bid.bid !== 0) {
          const bidderProfile = await getProfileInfo(bid.bidder);
          setHighestBid({
            ...bid,
            bidder: bidderProfile,
          });
          if (bid.bidder === wallet) {
            setIsHighestBidder(true);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const hasAnOffer = async () => {
    let hasMyOffer = offers.current.find(
      (offer) => offer.creator.wallet === wallet
    );

    if (hasMyOffer) {
      const now = new Date().getTime();
      const deadline = new Date(hasMyOffer.deadline * 1000).getTime();
      if (now < deadline) {
        const now = new Date().getTime();
        const deadline = new Date(hasMyOffer.deadline * 1000);

        if (now < deadline) {
          setMyOffer(hasMyOffer);
        }
      }
    }
  };

  const handleSendItem = async (to) => {
    await sendItemGassles(collectionInfo.contractAddress, wallet, to, tokenId);

    await registerSentItem(collectionInfo.contractAddress, tokenId, wallet, to);
    const newOwner = await getProfileInfo(to);

    profileOwnerData.current = newOwner;
    setIsOwner(false);
  };
  const handleDeleteItem = async () => {
    //Lamar a la api y eliminar item
    await burnItemGassles(collectionInfo.contractAddress, tokenId);
    await deleteNftItem(collectionInfo.contractAddress, tokenId);
  };
  const handleListItem = async (price, payToken) => {
    /*  if (!isFreezedMetadata) {
      await setFreezedMetadata(
        collectionInfo.contractAddress,
        tokenInfo.current,
        tokenId
      );
      setIsFreezedMetadata(true);
    } */
    await listItem(collectionInfo.contractAddress, tokenId, price, payToken);

    let payTokenInfo = await getPayTokenInfo(payToken.contractAddress);
    listing.current = {
      price: price,
      payToken: payTokenInfo,
    };

    setIsForSale(true);
    setActionMade(1);
  };

  const handleUpdatePrice = async (newPrice, payToken) => {
    await updateListing(
      collectionInfo.contractAddress,
      tokenId,
      newPrice,
      payToken
    );

    if (listing.current.payToken.contractAddress !== payToken.contractAddress) {
      let payTokenInfo = await getPayTokenInfo(payToken.contractAddress);
      listing.current.payToken = payTokenInfo;
    }
    listing.current.price = newPrice;
    setActionMade(1);
  };

  const handleUnlistItem = async () => {
    await cancelListing(collectionInfo.contractAddress, tokenId);
    listing.current = null;
    setIsForSale(false);
    setActionMade(1);
  };

  const handleMakeOffer = async (offerPrice, deadline, payToken) => {
    await makeOffer(
      wallet,
      collectionInfo.contractAddress,
      tokenId,
      offerPrice,
      deadline,
      payToken
    );

    const offerCreator = await getProfileInfo(wallet);
    const payTokenInfo = await getPayTokenInfo(payToken.contractAddress);
    const _offer = {
      price: offerPrice,
      deadline: deadline,
      creator: offerCreator,
      payToken: payTokenInfo,
    };
    offers.current.push(_offer);
    offers.current = offers.current.sort((a, b) => {
      if (a.price > b.price) {
        return -1;
      } else {
        return 1;
      }
    });
    hasAnOffer();
  };

  const handleAcceptOffer = async (from) => {
    /* if (!isFreezedMetadata) {
      await setFreezedMetadata(
        collectionInfo.contractAddress,
        tokenInfo.current,
        tokenId
      );
      setIsFreezedMetadata(true);
    } */
    await setAcceptedOffer(collectionInfo.contractAddress, tokenId, from);
    await acceptOffer(collectionInfo.contractAddress, tokenId, from);

    listing.current = null;
    offers.current = [];

    const profile = await getProfileInfo(from);
    profileOwnerData.current = profile;
    setIsOwner(false);

    setIsForSale(false);
    setActionMade(1);
  };

  const handleCancelOffer = async () => {
    await cancelOffer(collectionInfo.contractAddress, tokenId, myOffer.price);

    offers.current = offers.current.filter(
      (offer) => offer.creator.wallet !== wallet
    );
    setMyOffer(null);
  };

  const handleModifyOffer = async (offerPrice, deadline, payToken) => {
    await modifyOrder(
      wallet,
      collectionInfo.contractAddress,
      tokenId,
      offerPrice,
      deadline,
      payToken
    );

    let newOffer = await getOffer(
      collectionInfo.contractAddress,
      tokenId,
      wallet
    );

    newOffer = {
      ...newOffer,
      creator: userProfile,
    };

    offers.current = offers.current.filter(
      (offer) => offer.creator.wallet !== wallet
    );

    offers.current.push(newOffer);

    //Modify offer!
  };

  const handleBuyItem = async () => {
    await buyItem(
      wallet,
      collectionInfo.contractAddress,
      tokenId,
      tokenInfo?.current.owner,
      listing.current?.price,
      listing.current?.payToken
    );
    offers.current = [];

    let profile = await getProfileInfo(wallet);
    profileOwnerData.current = profile;

    setIsOwner(true);
    setIsFreezedMetadata(true);
    setIsForSale(false);

    setActionMade(1);
  };

  const handleCreateAuction = async (
    reservePrice,
    buyNowPrice,
    minimumBid,
    startTime,
    endTime,
    payToken
  ) => {
    await createAuction(
      wallet,
      collectionInfo.contractAddress,
      tokenId,
      reservePrice,
      buyNowPrice,
      minimumBid,
      startTime,
      endTime,
      payToken
    );

    const payTokenInfo = await getPayTokenInfo(payToken.contractAddress);
    auctionInfo.current = {
      owner: wallet,
      reservePrice: reservePrice,
      buyNowPrice: buyNowPrice,
      startTime: startTime,
      endTime: endTime,
      payToken: payTokenInfo,
    };

    offers.current = [];
    setMyOffer(null);

    setIsOnAuction(true);
  };

  const handleCancelAuction = async () => {
    await cancelAuction(collectionInfo.contractAddress, tokenId);
    setIsOnAuction(false);
    auctionInfo.current = null;
  };

  const handleUpdateAuction = async (startTime, endTime, reservePrice) => {
    if (
      reservePrice !== 0 &&
      parseFloat(reservePrice) !== parseFloat(auctionInfo.current.reservePrice)
    ) {
      await updateReservePrice(
        collectionInfo.contractAddress,
        tokenId,
        reservePrice
      );

      auctionInfo.current.reservePrice = reservePrice;
    }

    if (
      startTime.toISOString() !==
      new Date(auctionInfo.current.startTime * 1000).toISOString()
    ) {
      startTime = Math.floor(startTime.getTime() / 1000);

      await updateStartTime(collectionInfo.contractAddress, tokenId, startTime);

      auctionInfo.current.startTime = startTime;
    }

    if (
      endTime.toISOString() !==
      new Date(auctionInfo.current.endTime * 1000).toISOString()
    ) {
      endTime = Math.floor(endTime.getTime() / 1000);

      await updateEndTime(collectionInfo.contractAddress, tokenId, endTime);

      auctionInfo.current.endTime = endTime;
    }
  };

  const handleMakeBid = async (bidAmount) => {
    await makeBid(wallet, collectionInfo.contractAddress, tokenId, bidAmount);

    const profile = await getProfileInfo(wallet);
    let _highestBid = {
      bid: bidAmount,
      bidder: profile,
    };
    setHighestBid(_highestBid);
    setIsHighestBidder(true);
  };

  const hanldeBuyNow = async () => {
    await buyNow(
      wallet,
      collectionInfo.contractAddress,
      tokenId,
      auctionInfo.current?.buyNowPrice
    );

    offers.current = [];

    let profile = await getProfileInfo(wallet);
    profileOwnerData.current = profile;

    auctionInfo.current = null;
    setIsOnAuction(false);
    setIsOwner(true);
    setIsForSale(false);
    setActionMade(1);
  };

  const toggleFavorite = async () => {
    if (isLiked) {
      await deleteFavorite(collectionInfo.contractAddress, tokenId, wallet);
      setIsLiked(false);
      setLikes(likes - 1);
    } else {
      await addFavorite(collectionInfo.contractAddress, tokenId, wallet);
      setIsLiked(true);
      setLikes(likes + 1);
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      await getItemDetails();
      setLoading(false);
      await getAuctions().then(() => {
        getBid();
        hasAnOffer();
      });
      const CoinGeckoClient = new CoinGecko();
      let data = await CoinGeckoClient.simple.price({ ids: ["fantom"] });
      setCoinPrice(data.data.fantom.usd);
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [collection, tokenId, wallet]);

  useEffect(() => {
    const fetchData = async () => {
      if (actionMade === 1) {
        let changed = true;
        while (changed) {
          const res = await getNftHistory(
            collectionInfo.contractAddress,
            tokenId
          );
          if (res.length !== tokenHistoryInfo.current.length) {
            tokenHistoryInfo.current = res;
            changed = false;
          }
        }
        setActionMade(0);
      }
    };
    fetchData();
  }, [actionMade]);

  return (
    <div className="h-screen w-screen dark:bg-dark-1">
      <div
        ref={top}
        className=" dark:bg- mt-[79px] pt-10 mb-[50px] mx-[50px] grid grid-cols-1  md:grid-cols-[400px_minmax(300px,_0.9fr)] md:grid-rows-[auto_auto] gap-7"
      >
        {loading ? (
          <div className="w-screen h-[50vh] w-[80vw] md:w-[100vw] animate-pulse flex items-center justify-center">
            <img src={fibboLogo} className="w-[128px] animate-spin" />
          </div>
        ) : (
          <>
            <DetailImage
              isFreezedMetadata={isFreezedMetadata}
              collectionInfo={collectionInfo}
              tokenInfo={tokenInfo?.current}
              tokenImage={tokenInfo?.current.image}
              tokenName={tokenInfo?.current.name}
              loading={loading}
              likes={likes}
              isLiked={isLiked}
              wallet={wallet}
              categories={categories.map((cat) => {
                return {
                  ...cat,
                  name: lang === "eng" ? cat.name.eng : cat.name.esp,
                };
              })}
              toggleFavorite={toggleFavorite}
            />
            <div className="col-span-1 row-span-3  flex flex-col gap-5 dark:">
              {loading ? (
                <div className="w-full h-full animate-pulse bg-gray-300"></div>
              ) : (
                <div className="flex w-full justify-between">
                  <div className="flex flex-col  items-start gap-2 w-full">
                    {_width < 900 && (
                      <div className="flex w-full justify-center mb-2">
                        <div className="flex border  h-fit rounded-xl dark:text-white">
                          <ItemPageOption
                            icon="charm:refresh"
                            tooltip="refresh-item"
                            onClick={() => setRefreshMetadata(!refreshMetadata)}
                            tooltipText={literals.itemPage.refreshMeta}
                          />
                          {isOwner && !isForSale && !isOnAuction && (
                            <ItemPageOption
                              icon="fluent:send-16-filled"
                              tooltip="transfer-item"
                              onClick={() => setOpenTransferModal(true)}
                              tooltipText={literals.actions.sendNFT}
                            />
                          )}

                          {!isFreezedMetadata &&
                            isOwner &&
                            !isForSale &&
                            !isOnAuction &&
                            isCreator && (
                              <ItemPageOption
                                onClick={goToEdit}
                                icon="bxs:edit-alt"
                                tooltip="edit-item"
                                tooltipText={literals.actions.editNFT}
                              />
                            )}
                          {isOwner &&
                            !isForSale &&
                            !isOnAuction &&
                            !isFreezedMetadata && (
                              <ItemPageOption
                                icon="fluent:delete-dismiss-24-filled"
                                tooltip="delete-item"
                                onClick={() => setOpenDeleteModal(true)}
                                tooltipText={literals.actions.deleteNftItem}
                              />
                            )}
                          {tokenInfo?.current.externalLink &&
                            tokenInfo?.current.externalLink !== "" && (
                              <ItemPageOption
                                onClick={goToExternalLink}
                                icon="ooui:new-window-ltr"
                                tooltip="external-item"
                                tooltipText={literals.actions.seeExternalLink}
                              />
                            )}
                          <ItemPageOption
                            disabled
                            icon="bi:share-fill"
                            tooltip="share-item"
                            tooltipText={literals.actions.share}
                          />
                          <ItemMenuPageOption
                            position="last"
                            icon="akar-icons:more-vertical"
                            tooltip="more-item"
                            disabled
                            //disabled={wallet === "" || !wallet}
                            tooltipText={literals.actions.moreOptions}
                          >
                            <div
                              onClick={() => setShowReport(true)}
                              className="cursor-pointer flex items-center gap-2 px-2 py-2 hover:bg-gray-300"
                            >
                              <Icon icon="ic:baseline-report" width={32}></Icon>
                              <div>{literals.actions.reportItem}</div>
                            </div>
                          </ItemMenuPageOption>
                          {showReport && (
                            <ReportModal
                              showModal={showReport}
                              handleCloseModal={() => setShowReport(false)}
                              type="NFT"
                              reportedItem={{
                                collection: collectionInfo.contractAddress,
                                tokenId: tokenId,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3 items-center">
                      <img
                        src={properties?.collection?.logoImage}
                        alt="recipient-img"
                        className="rounded-full"
                        width={32}
                      />
                      <div
                        onClick={redirectToCollecion}
                        className="text-primary-2 cursor-pointer"
                      >
                        {properties?.collection?.name}
                      </div>
                    </div>
                    <div className="flex  items-center gap-4">
                      <div className="text-3xl">
                        <b>{tokenInfo?.current.name}</b>
                      </div>
                    </div>
                  </div>
                  {_width > 900 && (
                    <div className="flex border  h-fit rounded-xl dark:text-white">
                      <ItemPageOption
                        icon="charm:refresh"
                        tooltip="refresh-item"
                        onClick={() => setRefreshMetadata(!refreshMetadata)}
                        tooltipText={literals.itemPage.refreshMeta}
                      />
                      {isOwner && !isForSale && !isOnAuction && (
                        <ItemPageOption
                          icon="fluent:send-16-filled"
                          tooltip="transfer-item"
                          onClick={() => setOpenTransferModal(true)}
                          tooltipText={literals.actions.sendNFT}
                        />
                      )}

                      {!isFreezedMetadata &&
                        isOwner &&
                        !isForSale &&
                        !isOnAuction &&
                        isCreator && (
                          <ItemPageOption
                            onClick={goToEdit}
                            icon="bxs:edit-alt"
                            tooltip="edit-item"
                            tooltipText={literals.actions.editNFT}
                          />
                        )}
                      {isOwner &&
                        !isForSale &&
                        !isOnAuction &&
                        !isFreezedMetadata && (
                          <ItemPageOption
                            icon="fluent:delete-dismiss-24-filled"
                            tooltip="delete-item"
                            onClick={() => setOpenDeleteModal(true)}
                            tooltipText={literals.actions.deleteNftItem}
                          />
                        )}
                      {tokenInfo?.current.externalLink &&
                        tokenInfo?.current.externalLink !== "" && (
                          <ItemPageOption
                            onClick={goToExternalLink}
                            icon="ooui:new-window-ltr"
                            tooltip="external-item"
                            tooltipText={literals.actions.seeExternalLink}
                          />
                        )}
                      <ItemPageOption
                        disabled
                        icon="bi:share-fill"
                        tooltip="share-item"
                        tooltipText={literals.actions.share}
                      />
                      <ItemMenuPageOption
                        position="last"
                        icon="akar-icons:more-vertical"
                        tooltip="more-item"
                        disabled
                        //disabled={wallet === "" || !wallet}
                        tooltipText={literals.actions.moreOptions}
                      >
                        <div
                          onClick={() => setShowReport(true)}
                          className="cursor-pointer flex items-center gap-2 px-2 py-2 hover:bg-gray-300"
                        >
                          <Icon icon="ic:baseline-report" width={32}></Icon>
                          <div>{literals.actions.reportItem}</div>
                        </div>
                      </ItemMenuPageOption>
                      {showReport && (
                        <ReportModal
                          showModal={showReport}
                          handleCloseModal={() => setShowReport(false)}
                          type="NFT"
                          reportedItem={{
                            collection: collectionInfo.contractAddress,
                            tokenId: tokenId,
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              {loading ? (
                <div className="w-full h-full animate-pulse bg-gray-300"></div>
              ) : (
                <p>{tokenInfo?.current.description}</p>
              )}
              <div className="flex-row justify-center items-center  ">
                {loading ? (
                  <div className="w-full h-full animate-pulse bg-gray-300"></div>
                ) : (
                  <div className="flex items-center gap-4">
                    <b>{literals.itemPage.owner} </b>
                    <div
                      onClick={() => redirectToProfile()}
                      className="flex items-center gap-2 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition duration-150 ease-in-out"
                    >
                      <img
                        className="rounded-full"
                        width={32}
                        src={profileOwnerData?.current.profileImg}
                        alt=""
                      />
                      <p className="text-md">
                        {isOwner ? (
                          `${literals.detailNFT.you} (${profileOwnerData?.current.username})`
                        ) : (
                          <>
                            {profileOwnerData?.current.username ===
                            "Fibbo Artist"
                              ? truncateWallet(
                                  profileOwnerData.current.wallet,
                                  5
                                )
                              : profileOwnerData?.current.username}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {tokenInfo.current.additionalContent && isOwner && (
                <div
                  onClick={() => setOpenAdditionalModal(true)}
                  className="flex bg-gray-800 cursor-pointer  items-center text-gray-500 text-lg border-gray border-2 p-3 rounded-md gap-3"
                >
                  <Icon icon="dashicons:unlock" width={48} />
                  <div>{literals.detailNFT.seeAdditional}</div>
                </div>
              )}
              <div className="flex flex-col justify-center flex-wrap py-3 rounded-md ">
                <>
                  {isOnAuction ? (
                    <div className="">
                      <div className="pt-2">
                        {auctionStarted
                          ? formatLiteral(literals.detailNFT.bidEnds, [
                              formatDate(auctionInfo.current?.endTime),
                              new Date(
                                auctionInfo.current?.endTime * 1000
                              ).toLocaleString(),
                            ])
                          : formatLiteral(literals.detailNFT.bidStarts, [
                              formatDate(auctionInfo.current?.startTime),
                              new Date(
                                auctionInfo.current?.startTime * 1000
                              ).toLocaleString(),
                            ])}
                      </div>
                      <div className="flex flex-col gap-4 border-t mt-2 pt-5 border-b pb-5 ">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 ">
                          <p>{literals.detailNFT.reservedPrice}</p>
                          <div className="flex items-center  gap-2">
                            <img
                              width={32}
                              src={auctionInfo.current?.payToken.image}
                              alt="Fantom coin"
                            />
                            <p>
                              {auctionInfo.current?.reservePrice} {""}
                              {auctionInfo.current?.payToken.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                              ($
                              {formatPriceInUsd(
                                parseFloat(
                                  auctionInfo.current?.reservePrice * coinPrice
                                ).toFixed(3)
                              )}
                              )
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between  gap-3 ">
                          <p>{literals.detailNFT.buyNowPrice}</p>
                          <div className="flex items-center  gap-2">
                            <img
                              width={32}
                              src={auctionInfo.current?.payToken.image}
                              alt="Fantom coin"
                            />
                            <p>
                              {auctionInfo.current?.buyNowPrice}{" "}
                              {auctionInfo.current?.payToken.name}{" "}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                              ($
                              {formatPriceInUsd(
                                parseFloat(
                                  auctionInfo.current?.buyNowPrice * coinPrice
                                ).toFixed(3)
                              )}
                              )
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between border-t mt-2 pt-4 gap-6">
                          <div>{literals.detailNFT.highestBid}:</div>
                          <div className="flex items-center  gap-2">
                            {highestBid ? (
                              <>
                                <img
                                  width={32}
                                  src={auctionInfo.current?.payToken.image}
                                  alt="Fantom coin"
                                />
                                <p>
                                  {highestBid?.bid}{" "}
                                  {auctionInfo.current?.payToken.name}{" "}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                  ($
                                  {formatPriceInUsd(
                                    parseFloat(
                                      highestBid?.bid * coinPrice
                                    ).toFixed(3)
                                  )}
                                  )
                                </p>
                              </>
                            ) : (
                              <p> -- </p>
                            )}
                          </div>
                        </div>
                        {highestBid && (
                          <div className="flex flex-row gap-6 items-center justify-between">
                            <div>Realizada Por: </div>
                            <div className="flex gap-2 items-center">
                              <img
                                className="rounded-full"
                                width={32}
                                src={highestBid.bidder.profileImg}
                                alt={`from-${highestBid.bidder._id}-img`}
                              />
                              <p
                                className="text-primary-2 underline cursor-pointer"
                                onClick={() =>
                                  isMobile
                                    ? navigate(
                                        `/account/${highestBid.bidder.wallet}`
                                      )
                                    : window.open(
                                        `/account/${highestBid.bidder.wallet}`,
                                        "_blank"
                                      )
                                }
                              >
                                {highestBid.bidder.username}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {isForSale && (
                        <>
                          <p>{literals.detailNFT.actualPrice}</p>
                          <div className="flex flex-row items-center gap-3 ">
                            <img
                              width={32}
                              src={listing?.current?.payToken.image}
                              alt="Fantom coin"
                            />
                            <p>
                              {listing?.current?.price}{" "}
                              {listing?.current?.payToken.name}{" "}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                              ($
                              {formatPriceInUsd(
                                parseFloat(
                                  listing?.current?.price * coinPrice
                                ).toFixed(3)
                              )}
                              )
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>

                {!loading && (
                  <div className="flex flex-col w-full items-center md:flex-row gap-3 mt-2">
                    {!isForSale && !isOnAuction && !isOwner && (
                      <>
                        {!myOffer ? (
                          <ActionButton
                            size="small"
                            buttonAction={() =>
                              !wallet
                                ? setOpenConnectionModal(true)
                                : setOpenOfferModal(true)
                            }
                            text={literals.actions.makeOffer}
                          />
                        ) : (
                          <>
                            <ActionButton
                              size="small"
                              buttonAction={() =>
                                !wallet
                                  ? setOpenConnectionModal(true)
                                  : setOpenModifyOfferModal(true)
                              }
                              text={literals.actions.modifyOffer}
                            />
                            <ActionButton
                              size="small"
                              buttonAction={() =>
                                !wallet
                                  ? setOpenConnectionModal(true)
                                  : setOpenCancelOfferModal(true)
                              }
                              text={literals.actions.cancelOffer}
                            />
                          </>
                        )}
                      </>
                    )}

                    {isForSale && !isOwner && (
                      <>
                        <ActionButton
                          size="small"
                          buttonAction={() =>
                            !wallet
                              ? setOpenConnectionModal(true)
                              : setOpenBuyModal(true)
                          }
                          text={literals.actions.buy}
                        />
                        {!myOffer ? (
                          <ActionButton
                            size="small"
                            buttonAction={() =>
                              !wallet
                                ? setOpenConnectionModal(true)
                                : setOpenOfferModal(true)
                            }
                            text={literals.actions.makeOffer}
                          />
                        ) : (
                          <>
                            <ActionButton
                              size="small"
                              buttonAction={() =>
                                !wallet
                                  ? setOpenConnectionModal(true)
                                  : setOpenModifyOfferModal(true)
                              }
                              text={literals.actions.modifyOffer}
                            />
                            <ActionButton
                              size="small"
                              buttonAction={() =>
                                !wallet
                                  ? setOpenConnectionModal(true)
                                  : setOpenCancelOfferModal(true)
                              }
                              text={literals.actions.cancelOffer}
                            />
                          </>
                        )}
                      </>
                    )}

                    {!isForSale && isOwner && !isOnAuction && (
                      <>
                        <ActionButton
                          size="small"
                          buttonAction={() =>
                            !wallet
                              ? setOpenConnectionModal(true)
                              : setOpenSellModal(true)
                          }
                          text={literals.detailNFT.putForSale}
                        />
                        <ActionButton
                          size="small"
                          buttonAction={() =>
                            !wallet
                              ? setOpenConnectionModal(true)
                              : setOpenCreateAuction(true)
                          }
                          text={literals.detailNFT.createAuction}
                        />
                      </>
                    )}

                    {isOwner && isForSale && (
                      <div className="flex flex-col md:flex-row gap-3">
                        <ActionButton
                          size="small"
                          buttonAction={() =>
                            !wallet
                              ? setOpenConnectionModal(true)
                              : setOpenChangePriceModal(true)
                          }
                          text={literals.actions.changePrice}
                        />
                        <ActionButton
                          size="small"
                          buttonAction={() =>
                            !wallet
                              ? setOpenConnectionModal(true)
                              : setOpenUnlistItemModal(true)
                          }
                          text={literals.actions.unlist}
                        />
                      </div>
                    )}

                    {isOnAuction && isOwner && (
                      <>
                        <ActionButton
                          size="small"
                          buttonAction={() =>
                            !wallet
                              ? setOpenConnectionModal(true)
                              : setOpenUpdateAuctionModal(true)
                          }
                          text={literals.detailNFT.update}
                        />
                        {!highestBid && (
                          <ActionButton
                            size="small"
                            buttonAction={() =>
                              !wallet
                                ? setOpenConnectionModal(true)
                                : setOpenCancelAuctionModal(true)
                            }
                            text={literals.detailNFT.cancel}
                          />
                        )}
                      </>
                    )}

                    {isOnAuction && !isOwner && (
                      <>
                        {!isHighestBidder && (
                          <ActionButton
                            disabled={!auctionStarted}
                            size="small"
                            buttonAction={() =>
                              !wallet
                                ? setOpenConnectionModal(true)
                                : setOpenBidModal(true)
                            }
                            text={literals.actions.makeBid}
                          />
                        )}
                        <ActionButton
                          disabled={!auctionStarted}
                          size="small"
                          buttonAction={() =>
                            !wallet
                              ? setOpenConnectionModal(true)
                              : setOpenBuyNowModal(true)
                          }
                          text={literals.actions.buyNow}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="">
                <ItemDirectOffers
                  onAcceptOffer={handleAcceptOffer}
                  onCancelOffer={handleCancelOffer}
                  isOwner={isOwner}
                  offers={offers.current}
                />
              </div>
            </div>

            <DetailInfo properties={properties} chainInfo={chainInfo} />

            <div className="col-span-1 md:col-span-2 row-span-3 ">
              <ItemHistory historyItems={tokenHistoryInfo.current} />
            </div>
            <div className="col-span-1 md:col-span-2 row-span-3 ">
              <MoreItems
                wallet={wallet}
                nfts={moreItems}
                collectionInfo={collectionInfo}
              />
            </div>
          </>
        )}
      </div>
      <RedirectModal
        onSaveOptions={handleSaveRedirect}
        wallet={wallet}
        link={tokenInfo?.current.externalLink}
        showModal={showRedirect}
        handleCloseModal={() => setShowRedirect(false)}
      />
      <TransferModal
        showModal={openTransferModal}
        handleCloseModal={() => setOpenTransferModal(false)}
        onSendItem={handleSendItem}
      />
      <DeleteItemModal
        showModal={openDeleteModal}
        collectionInfo={collectionInfo}
        handleCloseModal={() => setOpenDeleteModal(false)}
        onDeleteItem={handleDeleteItem}
      />
      <ConnectionModal
        showModal={openConnectionModal}
        handleCloseModal={() => setOpenConnectionModal(false)}
        connectToWallet={connectToWallet}
      />
      <>
        <PutForSaleModal
          collectionAddress={collectionInfo?.contractAddress}
          tokenId={tokenId}
          wallet={wallet}
          showModal={openSellModal}
          handleCloseModal={() => setOpenSellModal(false)}
          onListItem={handleListItem}
        />
        <CreateAuctionModal
          collection={collectionInfo?.contractAddress}
          tokenId={tokenId}
          wallet={wallet}
          tokenInfo={tokenInfo}
          showModal={openCreateAuction}
          handleCloseModal={() => setOpenCreateAuction(false)}
          onCreateAuction={handleCreateAuction}
        />
      </>
      <>
        <BuyItemModal
          tokenInfo={tokenInfo.current}
          wallet={wallet}
          listing={listing.current}
          showModal={openBuyModal}
          handleCloseModal={() => setOpenBuyModal(false)}
          onBuyItem={handleBuyItem}
        />

        <MakeOfferModal
          collection={collectionInfo?.contractAddress}
          tokenId={tokenId}
          tokenInfo={tokenInfo}
          wallet={wallet}
          showModal={openOfferModal}
          handleCloseModal={() => setOpenOfferModal(false)}
          onMakeOffer={handleMakeOffer}
        />

        {myOffer && (
          <>
            <RemoveOfferModal
              showModal={openCancelOfferModal}
              handleCloseModal={() => setOpenCancelOfferModal(false)}
              offer={myOffer}
              wallet={wallet}
              onCancelOffer={handleCancelOffer}
            />
            <ModifyOfferModal
              showModal={openModifyOfferModal}
              handleCloseModal={() => setOpenModifyOfferModal(false)}
              offer={myOffer}
              wallet={wallet}
              onModifyOffer={handleModifyOffer}
            />
          </>
        )}
      </>

      <>
        <MakeBidModal
          collection={collectionInfo?.contractAddress}
          tokenId={tokenId}
          showModal={openBidModal}
          handleCloseModal={(e) => setOpenBidModal(false)}
          highestBid={highestBid}
          auctionInfo={auctionInfo.current}
          wallet={wallet}
          onMakeBid={handleMakeBid}
        />
        <BuyNowModal
          collection={collectionInfo?.contractAddress}
          tokenId={tokenId}
          showModal={openBuyNowModal}
          handleCloseModal={(e) => setOpenBuyNowModal(false)}
          highestBid={highestBid}
          auctionInfo={auctionInfo.current}
          wallet={wallet}
          onBuyNow={hanldeBuyNow}
        />
      </>

      {auctionInfo.current && (
        <>
          <CancelAuctionModal
            collection={collectionInfo?.contractAddress}
            tokenId={tokenId}
            showModal={openCancelAuctionModal}
            handleCloseModal={(e) => setOpenCancelAuctionModal(false)}
            highestBid={highestBid}
            auctionInfo={auctionInfo.current}
            wallet={wallet}
            onCancelAuction={handleCancelAuction}
          />
          <UpdateAuctionModal
            showModal={openUpdateAuctionModal}
            handleCloseModal={(e) => setOpenUpdateAuctionModal(false)}
            highestBid={highestBid}
            auctionInfo={auctionInfo.current}
            auctionStarted={auctionStarted}
            wallet={wallet}
            onUpdateAuction={handleUpdateAuction}
          />
        </>
      )}
      <>
        <ChangePriceModal
          wallet={wallet}
          showModal={openChangePriceModal}
          handleCloseModal={() => setOpenChangePriceModal(false)}
          onUpdatePrice={handleUpdatePrice}
        />
        <UnlistItemModal
          tokenInfo={tokenInfo.current}
          wallet={wallet}
          listing={listing.current}
          showModal={openUnlistItemModal}
          handleCloseModal={() => setOpenUnlistItemModal(false)}
          onUnlistItem={handleUnlistItem}
        />
      </>

      {tokenInfo.current.additionalContent && isOwner && (
        <>
          <AdditionalContentModal
            showModal={openAdditionalModal}
            handleCloseModal={() => setOpenAdditionalModal(false)}
            additionalContent={tokenInfo.current.additionalContent}
          />
        </>
      )}
    </div>
  );
}

const ItemPageOption = ({
  position,
  icon,
  tooltip,
  tooltipText,
  tooltipPlacement,
  onClick,
  disabled,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } p-2 hover b  ${
        disabled
          ? "dark:text-gray-600 text-gray-200"
          : "dark:hover:text-gray-400 hover:text-gray-400"
      }`}
      data-for={tooltip}
      onClick={() => !disabled && onClick()}
      data-tip={tooltipText}
    >
      <Icon icon={icon} width={28} />
      {tooltip && !disabled && (
        <ReactTooltip
          id={tooltip}
          place={tooltipPlacement ? tooltipPlacement : "top"}
          type={theme === "dark" ? "light" : "dark"}
          effect="solid"
          multiline={true}
        />
      )}
    </div>
  );
};

const ItemMenuPageOption = ({
  position,
  icon,
  tooltip,
  tooltipText,
  tooltipPlacement,
  disabled,
  children,
}) => {
  const { theme } = useContext(ThemeContext);
  const buttonRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);

  const showMenu = (e) => {
    setOpenMenu(!openMenu);
  };
  return (
    <div>
      <div
        onClick={() => !disabled && showMenu()}
        ref={buttonRef}
        className={`${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } p-2 hover ${
          disabled
            ? "dark:text-gray-600 text-gray-200"
            : "dark:hover:text-gray-400 hover:text-gray-400"
        }`}
        data-for={tooltip}
        data-tip={tooltipText}
      >
        <Icon icon={icon} width={28} />
        {tooltip && !disabled && (
          <ReactTooltip
            id={tooltip}
            place={tooltipPlacement ? tooltipPlacement : "top"}
            type={theme === "dark" ? "light" : "dark"}
            effect="solid"
            multiline={true}
          />
        )}
      </div>
      <MenuOptions
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        buttonRef={buttonRef}
      >
        {children}
      </MenuOptions>
    </div>
  );
};

const MenuOptions = ({ openMenu, setOpenMenu, buttonRef, children }) => {
  const ref = useRef(null);

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
    <div
      ref={ref}
      className="w-[175px] md:w-[200px] bg-gray-100 dark:bg-dark-2 absolute md:right-10 z-20 flex flex-col  rounded-md"
    >
      {openMenu && children}
    </div>
  );
};
