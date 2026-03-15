import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../../api";
import { PageWithLoading } from "../../../components/basic/PageWithLoading";
import NftCard from "../../../components/NftCard";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import useAccount from "../../../hooks/useAccount";
import { isMobile } from "web3modal";
import RedirectModal from "../../../components/modals/RedirectModal";
import { FiltersSidebarModal } from "../../../components/modals/FiltersSidebarModal";
import FiltersCollectionSidebar from "../../../components/FiltersCollectionSidebar";
import {
  orderByHighestP,
  orderByLowestP,
  orderByNearestEnd,
  orderByOldest,
  orderByOldestListed,
  orderByRecently,
  orderByRecentlyListed,
  sortMarketItems,
} from "../../../utils/sort";
import useResponsive from "../../../hooks/useResponsive";
import ReactTooltip from "react-tooltip";
import { ThemeContext } from "../../../context/ThemeContext";
import { ButtonTooltip } from "../../../components/tooltips/ButtonTooltip";
import { useStateContext } from "../../../context/StateProvider";
import { useTokens } from "../../../contracts/token";
import OwnersModal from "../../../components/modals/OwnersModal";
import ReportModal from "../../../components/modals/ReportModal";

export const CollectionDetailContainer = () => {
  const [loading, setLoading] = useState(true);
  const { collection } = useParams();
  const { _width } = useResponsive();
  const { getERC721Contract } = useTokens();

  const [{ lang, literals }] = useStateContext();
  const {
    getCollectionDetail,
    getProfileInfo,
    getAllPayTokens,
    getUserCollectionOptions,
    createUserCollectionOptions,
    setShowRedirectToLink,
    addCollectionToWatchlist,
    deleteFromWatchList,
    getAllCategories,
  } = useApi();
  const { wallet } = useAccount();
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [filtersSelected, setFiltersSelected] = useState([]);
  const [sortSelected, setSortSelected] = useState(0);
  const [userSmallview, setSmallViewUser] = useState(false);

  const [expandedDesc, setExpandedDesc] = useState(false);
  const [openedSidebar, setOpenedSidebar] = useState(false);

  const [liked, setLiked] = useState(false);

  const [queryText, setQueryText] = useState("");
  const [allErc20Tokens, setAllErc20Tokens] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [ownerInfo, setOwnerInfo] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [detailLink, setDetailLink] = useState("");

  const collectionUserOptions = useRef(null);
  const [showRedirect, setShowRedirect] = useState(false);
  const [showOwners, setShowOwners] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const navigate = useNavigate();
  const redirectToItem = (item) => {
    navigate(
      `/explore/${
        collectionInfo.customURL
          ? collectionInfo.customURL
          : item.collectionAddress
      }/${item.tokenId}`
    );
  };

  const changeSmallDisplay = () => {
    setSmallViewUser(true);
  };
  const changeBigDisplay = () => {
    setSmallViewUser(false);
  };

  const goToScan = () => {
    window.open(
      `https://testnet.ftmscan.com/address/${collectionInfo.contractAddress}`
    );
  };

  const openRedirectPopUp = (link) => {
    //Checker si tiene lo de no mostrar
    if (isOwner) {
      window.open(link);
    } else {
      if (collectionUserOptions.current.notShowRedirect) {
        window.open(link);
      } else {
        setDetailLink(link);
        setShowRedirect(true);
      }
    }
  };

  const addToWatchList = async () => {
    if (liked) {
      await deleteFromWatchList(collectionInfo.contractAddress, wallet);
      setLiked(false);
    } else {
      await addCollectionToWatchlist(collectionInfo.contractAddress, wallet);
      setLiked(true);
    }
  };

  const handleSaveOptions = async () => {
    await setShowRedirectToLink(collectionInfo.contractAddress, wallet);
    collectionUserOptions.current.notShowRedirect = true;
  };
  const redirectToEditCollection = () => {
    if (collectionInfo.customURL) {
      navigate(`/collection/${collectionInfo.customURL}/edit`);
    } else {
      navigate(`/collection/${collectionInfo.contractAddress}/edit`);
    }
  };

  const redirectToCreateItem = () => {
    if (collectionInfo.customURL) {
      navigate(`/collection/${collectionInfo.customURL}/create`);
    } else {
      navigate(`/collection/${collectionInfo.contractAddress}/create`);
    }
  };

  const searchItems = (query) => {
    setQueryText(query);
  };

  const sortItems = (value) => {
    setSortSelected(value);
    if (value === "2") {
      //recentyl created
      const sortedArray = collectionNfts.sort(orderByRecently);
      setFilteredNfts(sortedArray);
    }
    if (value === "3") {
      //oldest created
      const sortedArray = collectionNfts.sort(orderByOldest);
      setFilteredNfts(sortedArray);
    }
    if (value === "4") {
      let toSortAll = [];
      const forSaleAll = collectionNfts.filter(
        (item) => item.price !== undefined
      );
      const auctionAll = collectionNfts.filter(
        (item) => item.auction !== undefined
      );
      let leftItemsAll = collectionNfts.filter((item) => {
        return !forSaleAll.find((forSaleItem) => forSaleItem === item);
      });
      leftItemsAll = leftItemsAll.filter((item) => {
        return !auctionAll.find((auctioned) => auctioned === item);
      });

      toSortAll = [...forSaleAll, ...auctionAll];

      const sortedArrayAll = toSortAll.sort(orderByRecentlyListed);

      let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

      setFilteredNfts(finalArrayAll);
    }
    if (value === "5") {
      //Lowest price
      let toSortAll = [];
      const forSaleAll = collectionNfts.filter(
        (item) => item.price !== undefined
      );
      const auctionAll = collectionNfts.filter(
        (item) => item.auction !== undefined
      );
      let leftItemsAll = collectionNfts.filter((item) => {
        return !forSaleAll.find((forSaleItem) => forSaleItem === item);
      });
      leftItemsAll = leftItemsAll.filter((item) => {
        return !auctionAll.find((auctioned) => auctioned === item);
      });

      toSortAll = [...forSaleAll, ...auctionAll];

      const sortedArrayAll = toSortAll.sort(orderByOldestListed);

      let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

      setFilteredNfts(finalArrayAll);
    }
    if (value === "6") {
      //highest price
      let toOrderAll = [];
      const forSaleAll = collectionNfts.filter(
        (item) => item.price !== undefined
      );
      const offeredAll = collectionNfts.filter(
        (item) => item.offer !== undefined
      );
      const auctionAll = collectionNfts.filter(
        (item) => item.auction !== undefined
      );

      toOrderAll = [...forSaleAll, ...offeredAll, ...auctionAll];

      let leftItemsAll = collectionNfts.filter((item) => {
        return !forSaleAll.find((forSaleItem) => forSaleItem === item);
      });
      leftItemsAll = leftItemsAll.filter((item) => {
        return !offeredAll.find((offered) => offered === item);
      });
      leftItemsAll = leftItemsAll.filter((item) => {
        return !auctionAll.find((auctioned) => auctioned === item);
      });

      const sortedArrayAll = toOrderAll.sort(orderByHighestP);

      let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

      setFilteredNfts(finalArrayAll);
    }
    if (value === "7") {
      //Lowest price
      const sortedArray = collectionNfts.sort(orderByLowestP);
      setFilteredNfts(sortedArray);
    }
    if (value === "8") {
      const auctionsAll = collectionNfts.filter(
        (item) => item.auction !== undefined
      );
      const leftItemsAll = collectionNfts.filter((item) => {
        return !auctionsAll.find((auction) => auction === item);
      });

      const sortedArrayAll = auctionsAll.sort(orderByNearestEnd);

      let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

      setFilteredNfts(finalArrayAll);
    }
  };

  const filterBySelling = () => {
    let isSelected = filtersSelected.find(
      (item) => item === literals.filters.onSale
    );
    if (isSelected) {
      setFiltersSelected(
        filtersSelected.filter((item) => item !== literals.filters.onSale)
      );
    } else {
      setFiltersSelected([...filtersSelected, literals.filters.onSale]);
    }
  };

  const filterByOffered = () => {
    let isSelected = filtersSelected.find(
      (item) => item === literals.filters.offered
    );
    if (isSelected) {
      setFiltersSelected(
        filtersSelected.filter((item) => item !== literals.filters.offered)
      );
    } else {
      setFiltersSelected([...filtersSelected, literals.filters.offered]);
    }
  };

  const filterByAuctioned = () => {
    let isSelected = filtersSelected.find(
      (item) => item === literals.filters.onAuction
    );
    if (isSelected) {
      setFiltersSelected(
        filtersSelected.filter((item) => item !== literals.filters.onAuction)
      );
    } else {
      setFiltersSelected([...filtersSelected, literals.filters.onAuction]);
    }
  };

  const filterByBidded = () => {
    let isSelected = filtersSelected.find(
      (item) => item === literals.filters.hasBids
    );
    if (isSelected) {
      setFiltersSelected(
        filtersSelected.filter((item) => item !== literals.filters.hasBids)
      );
    } else {
      setFiltersSelected([...filtersSelected, literals.filters.hasBids]);
    }
  };

  const filterByFavorite = () => {
    let isSelected = filtersSelected.find((item) => item.favorites === true);
    if (isSelected) {
      setFiltersSelected(
        filtersSelected.filter((item) => item.favorites !== true)
      );
    } else {
      setFiltersSelected([
        ...filtersSelected,
        { favorites: true, name: literals.filters.favorites },
      ]);
    }
  };

  const filterByImage = () => {
    let isSelected = filtersSelected.find(
      (item) => item === literals.filters.image
    );
    if (isSelected) {
      setFiltersSelected(
        filtersSelected.filter((item) => item !== literals.filters.image)
      );
    } else {
      setFiltersSelected([...filtersSelected, literals.filters.image]);
    }
  };

  const filterByVideo = () => {
    let isSelected = filtersSelected.find(
      (item) => item === literals.filters.video
    );
    if (isSelected) {
      setFiltersSelected(
        filtersSelected.filter((item) => item !== literals.filters.video)
      );
    } else {
      setFiltersSelected([...filtersSelected, literals.filters.video]);
    }
  };

  const filterByAudio = () => {
    let isSelected = filtersSelected.find(
      (item) => item === literals.filters.audio
    );
    if (isSelected) {
      setFiltersSelected(
        filtersSelected.filter((item) => item !== literals.filters.audio)
      );
    } else {
      setFiltersSelected([...filtersSelected, literals.filters.audio]);
    }
  };

  const removeFilter = (filter) => {
    if (typeof filter === "object") {
      //selectPayTokenFilter(filter);
      if (filter.category) {
        removeCategoryFilter(filter);
      }
      if (filter.favorites) {
        removeFavoriteFilter(filter);
      }
    } else {
      switch (filter) {
        case literals.filters.onSale:
          filterBySelling();
          break;
        case literals.filters.offered:
          filterByOffered();
          break;
        case literals.filters.onAuction:
          filterByAuctioned();
          break;
        case literals.filters.hasBids:
          filterByBidded();
          break;
        case literals.filters.image:
          filterByImage();
          break;
        case literals.filters.video:
          filterByVideo();
          break;
        case literals.filters.audio:
          filterByAudio();
          break;
        default:
          break;
      }
    }
  };

  const selectPayTokenFilter = (token) => {
    let isSelected = filtersSelected.find(
      (item) => item.contractAddress === token.contractAddress
    );
    if (isSelected) {
      setFilteredNfts(collectionNfts);
      setFiltersSelected(
        filtersSelected.filter(
          (item) => item.contractAddress !== token.contractAddress
        )
      );
    } else {
      setFiltersSelected([...filtersSelected, token]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const collectionDetail = await getCollectionDetail(collection, wallet);
      setIsOwner(collectionDetail.creator === wallet);
      if (collectionDetail.creator !== wallet) {
        let collOptions = await getUserCollectionOptions(
          collectionDetail.contractAddress,
          wallet
        );
        if (collOptions) {
          collectionUserOptions.current = collOptions;
        } else {
          let created = await createUserCollectionOptions(
            collectionDetail.contractAddress,
            wallet
          );
          collectionUserOptions.current = created;
        }
      }
      const _ownerInfo = await getProfileInfo(collectionDetail.creator);
      setOwnerInfo(_ownerInfo);
      const _payTokens = await getAllPayTokens();
      setAllErc20Tokens(_payTokens);

      const cats = await getAllCategories();

      setAllCategories(cats);

      setCollectionInfo(collectionDetail);
      setLiked(collectionDetail.liked);
      setCollectionNfts(collectionDetail.nfts);
      setFilteredNfts(collectionDetail.nfts);
      setLoading(false);
    };
    fetchData();
  }, [wallet]);

  const selectCategory = (categoryItem) => {
    const categoryName =
      lang === "eng" ? categoryItem.name.eng : categoryItem.name.esp;
    let isSelected = filtersSelected.find(
      (item) => item.category === categoryName
    );

    if (isSelected) {
      setFilteredNfts(collectionNfts);
      setFiltersSelected(
        filtersSelected.filter((item) => item.category !== categoryName)
      );
    } else {
      setFiltersSelected([
        ...filtersSelected,
        {
          category: categoryName,
          name: categoryName,
          identifier: categoryItem.identifier,
        },
      ]);
    }
  };

  const removeCategoryFilter = (categoryItem) => {
    let isSelected = filtersSelected.find(
      (item) => item.category === categoryItem.name
    );
    if (isSelected) {
      setFilteredNfts(collectionNfts);
      setFiltersSelected(
        filtersSelected.filter((item) => item.category !== categoryItem.name)
      );
    }
  };

  const removeFavoriteFilter = (filter) => {
    let isSelected = filtersSelected.find((item) => item.favorites === true);
    if (isSelected) {
      setFilteredNfts(collectionNfts);
      setFiltersSelected(
        filtersSelected.filter((item) => item.favorites !== true)
      );
    }
  };

  useEffect(() => {
    if (filtersSelected.length > 0) {
      let filtered = [];
      filtersSelected.forEach((filter) => {
        if (filter === literals.filters.onSale) {
          let result = collectionNfts.filter(
            (item) => item.price !== undefined
          );
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.offered) {
          let result = collectionNfts.filter(
            (item) => item.offer !== undefined
          );
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.onAuction) {
          let result = collectionNfts.filter(
            (item) => item.auction !== undefined
          );
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.hasBids) {
          let result = collectionNfts.filter(
            (item) => item.auction?.topBid !== undefined
          );
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.image) {
          let result = collectionNfts.filter(
            (item) => item.contentType === "IMG"
          );
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.video) {
          let result = collectionNfts.filter(
            (item) => item.contentType === "VIDEO"
          );
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.audio) {
          let result = collectionNfts.filter(
            (item) => item.contentType === "AUDIO"
          );
          filtered = [...filtered, ...result];
        }

        if (filter.category) {
          let _result = [];
          _result = collectionNfts.filter((item) =>
            item.categories?.includes(filter.identifier)
          );
          filtered = [...filtered, ..._result];
        }
      });
      //remove duplicates
      let ids = [];

      let finalFiltered = filtered.map((filter) => {
        if (!ids.includes(filter._id)) {
          ids.push(filter._id);
          return filter;
        }
      });
      finalFiltered = finalFiltered.filter((item) => item !== undefined);

      if (queryText.length >= 1) {
        finalFiltered = finalFiltered.filter((item) => {
          if (item.name.toLowerCase().includes(queryText.toLowerCase())) {
            return item;
          }
        });
      }

      if (sortSelected !== 0 && sortSelected !== 1) {
        finalFiltered = sortMarketItems(sortSelected, finalFiltered);
      }
      setFilteredNfts(finalFiltered);
    } else {
      let finalFiltered = collectionNfts;
      if (queryText.length >= 1) {
        finalFiltered = finalFiltered.filter((item) => {
          if (item.name.toLowerCase().includes(queryText.toLowerCase())) {
            return item;
          }
        });
      }

      if (sortSelected !== 0 && sortSelected !== 1) {
        finalFiltered = sortMarketItems(sortSelected, collectionNfts);
      }
      setFilteredNfts(finalFiltered);
    }
  }, [filtersSelected, queryText]);
  return (
    <PageWithLoading loading={loading}>
      <div className="flex flex-col mt-[79px] mb-[10px] w-screen items-center justify-center">
        {collectionInfo?.bannerImage !== "" ? (
          <img
            className="flex w-full h-[200px] md:h-[300px] object-cover"
            src={collectionInfo?.bannerImage}
            alt={`banner-${collectionInfo?._id}`}
          ></img>
        ) : (
          <div className="h-full w-full dark:bg-dark-4 bg-gray-300 h-[200px] md:h-[300px] items-center"></div>
        )}
        <div className="flex flex-col md:flex-row w-full items-center">
          <div className="flex items-end md:pl-10 ">
            <div className="flex w-[200px] mt-[-80px] border-2 dark:border-dark-2">
              <img
                src={collectionInfo?.logoImage}
                alt={`col-${collection._id}`}
                className=""
              />
            </div>
          </div>
          <div className="flex md:items-end md:ml-[50px] mb-[20px] md:w-full mt-[20px] ">
            <div className="flex text-2xl flex-col md:flex-row items-center gap-4">
              {_width < 900 && (
                <div className="flex h-fit rounded-xl dark:text-white">
                  <div className="flex items-center">
                    {isOwner && (
                      <ItemPageOption
                        icon="carbon:add-alt"
                        tooltip="add-item"
                        onClick={redirectToCreateItem}
                        tooltipText={literals.actions.createNFT}
                      />
                    )}
                    {isOwner && (
                      <ItemPageOption
                        icon="bxs:edit-alt"
                        tooltip="edit-item"
                        onClick={redirectToEditCollection}
                        tooltipText={literals.actions.editCollection}
                      />
                    )}
                  </div>
                  <div className="mx-5"></div>

                  <div className="flex items-center">
                    {wallet !== "" && !isOwner && (
                      <ItemPageOption
                        disabled
                        icon={
                          liked
                            ? "clarity:favorite-solid"
                            : "clarity:favorite-line"
                        }
                        tooltip="watch-item"
                        tooltipText={
                          liked
                            ? literals.actions.deleteFromWatchlist
                            : literals.actions.addToWatchlist
                        }
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
                      disabled
                      //disabled={wallet === "" || !wallet}
                      icon="akar-icons:more-vertical"
                      tooltip="more-item"
                      tooltipText={literals.actions.moreOptions}
                    >
                      <div
                        onClick={() => setShowReport(true)}
                        className="cursor-pointer flex items-center gap-2 px-2 py-2 hover:bg-gray-300"
                      >
                        <Icon icon="ic:baseline-report" width={32}></Icon>
                        <div className="text-sm">
                          {literals.actions.reportCollection}
                        </div>
                      </div>
                    </ItemMenuPageOption>
                    {showReport && (
                      <ReportModal
                        showModal={showReport}
                        handleCloseModal={() => setShowReport(false)}
                        type="COLLECTION"
                        reportedItem={{
                          collection: collectionInfo.contractAddress,
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
              <b>{collectionInfo?.name}</b>
            </div>
          </div>
          {_width > 900 && (
            <div className="flex h-fit mr-10 rounded-xl dark:text-white">
              <div className="flex items-center">
                {isOwner && (
                  <ItemPageOption
                    icon="carbon:add-alt"
                    tooltip="add-item"
                    onClick={redirectToCreateItem}
                    tooltipText={literals.actions.createNFT}
                  />
                )}
                {isOwner && (
                  <ItemPageOption
                    icon="bxs:edit-alt"
                    tooltip="edit-item"
                    onClick={redirectToEditCollection}
                    tooltipText={literals.actions.editCollection}
                  />
                )}
              </div>
              <div className="mx-5 w-[1px] border-2"></div>
              <div className="flex items-center">
                {wallet !== "" && !isOwner && (
                  <ItemPageOption
                    onClick={addToWatchList}
                    icon={
                      liked ? "clarity:favorite-solid" : "clarity:favorite-line"
                    }
                    tooltip="watch-item"
                    tooltipText={
                      liked
                        ? literals.actions.deleteFromWatchlist
                        : literals.actions.addToWatchlist
                    }
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
                    <div>{literals.actions.reportCollection}</div>
                  </div>
                </ItemMenuPageOption>
                {showReport && (
                  <ReportModal
                    showModal={showReport}
                    handleCloseModal={() => setShowReport(false)}
                    type="COLLECTION"
                    reportedItem={{
                      collection: collectionInfo.contractAddress,
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-left gap-5 ml-[50px] mt-[20px] ">
          <div className="flex text-md ">
            <b>{literals.collectionDetail.creator}: </b>
          </div>
          <div className="flex gap-3 items-center">
            <img
              src={ownerInfo?.profileImg}
              alt="recipient-img"
              className="rounded-full"
              width={32}
            />
            <div
              onClick={() =>
                isMobile
                  ? navigate(`/account/${ownerInfo?.wallet}`)
                  : window.open(`/account/${ownerInfo?.wallet}`)
              }
              className="text-primary-2 underline cursor-pointer"
            >
              {isOwner
                ? `${literals.detailNFT.you} (${ownerInfo?.username})`
                : ownerInfo?.username}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[80vw] md:w-[60vw]  mt-[30px] mr-[50px] ml-[50px]">
          <p className="text-md justify-center md:text-lg ">
            {expandedDesc
              ? collectionInfo?.description
              : `${collectionInfo?.description.substring(0, 70)}...`}
          </p>
          {expandedDesc ? (
            <p
              onClick={() => setExpandedDesc(!expandedDesc)}
              className="text-gray-400 mt-2 flex items-center gap-3 cursor-pointer"
            >
              Ver menos <Icon icon="akar-icons:chevron-up" />
            </p>
          ) : (
            <p
              onClick={() => setExpandedDesc(!expandedDesc)}
              className=" text-gray-400 mt-2 flex items-center gap-3 cursor-pointer"
            >
              {literals.collectionDetail.seeMore}
              <Icon icon="akar-icons:chevron-down" />
            </p>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 sm:mr-[50px] sm:ml-[50px] mr-0 ml-0 items-center place-content-between gap-8">
          <div className="flex gap-8 ">
            <div className="flex flex-col items-center">
              <div className="flex text-xl">
                <b>{collectionNfts.length}</b>
              </div>
              <div className="flex items-end text-sm text-gray-400">
                {literals.collectionDetail.articles}
              </div>
            </div>
            <div
              onClick={() => setShowOwners(true)}
              className="cursor-pointer flex flex-col items-center hover:text-gray-300"
            >
              <div className="flex text-xl">
                <b>{collectionInfo?.owners.length}</b>
              </div>
              <div className="flex items-end text-sm text-gray-400">
                {literals.collectionDetail.owners}
              </div>
            </div>
            <div className="flex flex-col  items-center">
              <div className="flex text-xl">
                <b>{parseFloat(collectionInfo?.volumen)} FTM</b>
              </div>
              <div className="flex items-end text-sm text-gray-400">
                {literals.collectionDetail.totalVolume}
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-10 mt-10 md:mt-0 md:mr-5">
            <ButtonTooltip
              tooltip="scan-tooltip"
              tooltipPlacement="top"
              tooltipText={literals.actions.seeInScanner}
              onClick={goToScan}
            >
              <div className="flex">
                <Icon width={25} icon="bi:upc-scan"></Icon>
              </div>
            </ButtonTooltip>

            {collectionInfo?.websiteURL !== "" && (
              <ButtonTooltip
                tooltip="web-tooltip"
                tooltipPlacement="top"
                tooltipText={literals.actions.seeWebsite}
                onClick={() => openRedirectPopUp(collectionInfo.websiteURL)}
              >
                <Icon width={25} icon="dashicons:admin-site-alt3"></Icon>
              </ButtonTooltip>
            )}
            {collectionInfo?.discordURL !== "" && (
              <ButtonTooltip
                tooltip="ds-tooltip"
                tooltipPlacement="top"
                tooltipText={literals.actions.seeDiscord}
                onClick={() => openRedirectPopUp(collectionInfo.discordURL)}
              >
                <Icon width={25} icon="bi:discord"></Icon>
              </ButtonTooltip>
            )}
            {collectionInfo?.telegramURL !== "" && (
              <ButtonTooltip
                tooltip="telegram-tooltip"
                tooltipPlacement="top"
                tooltipText={literals.actions.seeTelegram}
                onClick={() => openRedirectPopUp(collectionInfo.telegramURL)}
              >
                <Icon width={25} icon="bxl:telegram"></Icon>
              </ButtonTooltip>
            )}
            {collectionInfo?.instagramURL !== "" && (
              <ButtonTooltip
                tooltip="insta-tooltip"
                tooltipPlacement="top"
                tooltipText={literals.actions.seeInstagram}
                onClick={() => openRedirectPopUp(collectionInfo.instagramURL)}
              >
                <Icon width={25} icon="cib:instagram"></Icon>
              </ButtonTooltip>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-10 w-full items-center justify-end mr-[100px]">
        <div className="flex w-full mt-10 border-t h-full">
          {_width > 900 && (
            <FiltersCollectionSidebar
              openedSidebar={true}
              items={filteredNfts}
              filtersSelected={filtersSelected}
              statusFilters={[
                { name: literals.filters.onSale, filter: filterBySelling },
                { name: literals.filters.offered, filter: filterByOffered },
                { name: literals.filters.onAuction, filter: filterByAuctioned },
                { name: literals.filters.hasBids, filter: filterByBidded },
              ]}
              contentFilters={[
                { name: literals.filters.image, filter: filterByImage },
                { name: literals.filters.video, filter: filterByVideo },
                { name: literals.filters.audio, filter: filterByAudio },
              ]}
              payTokenFilters={allErc20Tokens.map((item) => {
                return {
                  ...item,
                  filter: selectPayTokenFilter,
                };
              })}
              categories={allCategories}
              selectCategory={selectCategory}
            />
          )}
          <div className="h-full md:h-[800px] overflow-y-hidden flex w-full flex-col gap-4 md:overflow-y-scroll overflow-x-hidden ">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-10 w-full mt-[30px] sm:mt-[50px] items-center justify-center">
              <div className="w-80 flex border-2 rounded">
                <div className="flex items-center justify-center px-4 border-l">
                  <Icon icon="ant-design:search-outlined" />
                </div>
                <input
                  onChange={(e) => searchItems(e.target.value)}
                  type="text"
                  value={queryText}
                  className={`px-4 py-2 outline-none dark:bg-dark-1`}
                  placeholder={literals.navbar.searchItems}
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                {_width < 900 && (
                  <>
                    <button
                      onClick={() => setOpenedSidebar(true)}
                      className="hover:-translate-y-1"
                    >
                      <Icon
                        icon="akar-icons:filter"
                        width="40"
                        height="40"
                        color="grey"
                      />
                    </button>
                  </>
                )}
                {/* <div>
                  <ButtonTooltip
                    onClick={filterByFavorite}
                    tooltip="filter-favorite"
                    tooltipText={literals.filters.seeFavorites}
                    tooltipPlacement="bottom"
                  >
                    <Icon
                      icon={
                        filtersSelected.find((f) => f.favorites === true)
                          ? "uis:favorite"
                          : "uit:favorite"
                      }
                      width={48}
                    />
                  </ButtonTooltip>
                </div> */}
                <select
                  onChange={(e) => sortItems(e.target.value)}
                  className="cursor-pointer h-10 w-40 md:w-60 flex border border-gray-300 bg-white dark:bg-dark-1 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value={1}>{literals.explore.filterSort}</option>
                  <option value={2}>{literals.explore.filterRecently}</option>
                  <option value={3}>{literals.explore.filterOldest}</option>
                  <option value={4}>
                    {literals.explore.filterRecentlyListed}
                  </option>
                  <option value={5}>
                    {literals.explore.filterOldestListed}
                  </option>
                  <option value={6}>{literals.explore.filterHighPrice}</option>
                  <option value={7}>{literals.explore.filterLowPrice}</option>
                  <option value={8}>{literals.explore.filterEnding}</option>
                </select>

                <button
                  onClick={changeSmallDisplay}
                  className="hover:-translate-y-1"
                >
                  <Icon
                    icon="akar-icons:dot-grid-fill"
                    width="40"
                    height="40"
                    color="grey"
                  />
                </button>
                <button
                  onClick={changeBigDisplay}
                  className="hover:-translate-y-1 "
                >
                  <Icon
                    icon="ci:grid-big-round"
                    width="60"
                    height="60"
                    color="grey"
                  />
                </button>
              </div>
            </div>
            <div className="mt-2 ml-5 px-5 flex gap-2 flex-wrap md:flex-row justify-start items-center ">
              {filtersSelected.map((filter) => {
                return (
                  <div
                    key={Math.random(1, 999999)}
                    onClick={() => removeFilter(filter)}
                    className="cursor-pointer text-xs md:text-sm  flex  items-center gap-2 dark:bg-dark-2 hover:bg-gray-200 hover:dark:bg-dark-4 border border-gray-200 rounded-xl px-8 py-3"
                  >
                    {typeof filter === "object" ? (
                      <div className="flex gap-2 items-center">
                        {filter.image && <img src={filter.image} width={24} />}
                        {filter.name}
                      </div>
                    ) : (
                      filter
                    )}

                    <Icon icon="ep:close" width={24} />
                  </div>
                );
              })}
              {filtersSelected.length > 0 && (
                <div
                  onClick={() => setFiltersSelected([])}
                  className=" cursor-pointer transition ml-5 text-gray-400 dark:hover:text-white hover:text-black"
                >
                  Limpiar Todos
                </div>
              )}
            </div>
            <div className="flex  flex-wrap justify-center gap-4 w-full pb-10">
              {filteredNfts.length > 0 ? (
                <>
                  {filteredNfts.map((item) => {
                    return (
                      <NftCard
                        key={item._id}
                        item={item}
                        wallet={wallet}
                        onClick={() => redirectToItem(item)}
                        isSmall={userSmallview}
                      />
                    );
                  })}
                </>
              ) : (
                <>
                  <div>
                    {filtersSelected.length > 0 || queryText.length > 0
                      ? literals.collectionDetail.notFoundItems
                      : literals.collectionDetail.noItems}
                  </div>
                </>
              )}
            </div>
          </div>
          {_width < 900 && (
            <FiltersSidebarModal
              openSidebar={openedSidebar}
              setOpenSidebar={setOpenedSidebar}
              statusFilters={[
                { name: literals.filters.onSale, filter: filterBySelling },
                { name: literals.filters.offered, filter: filterByOffered },
                { name: literals.filters.onAuction, filter: filterByAuctioned },
                { name: literals.filters.hasBids, filter: filterByBidded },
              ]}
              contentFilters={[
                { name: literals.filters.image, filter: filterByImage },
                { name: literals.filters.video, filter: filterByVideo },
                { name: literals.filters.audio, filter: filterByAudio },
              ]}
              filtersSelected={filtersSelected}
              payTokenFilters={allErc20Tokens.map((item) => {
                return {
                  ...item,
                  filter: selectPayTokenFilter,
                };
              })}
              categories={allCategories}
              selectCategory={selectCategory}
            />
          )}
        </div>
        <RedirectModal
          onSaveOptions={handleSaveOptions}
          wallet={wallet}
          userCollectionOptions={collectionUserOptions.current}
          link={detailLink}
          showModal={showRedirect}
          handleCloseModal={() => setShowRedirect(false)}
        />
        <OwnersModal
          owners={collectionInfo?.owners}
          link={detailLink}
          showModal={showOwners}
          handleCloseModal={() => setShowOwners(false)}
        />
      </div>
    </PageWithLoading>
  );
};

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
      } p-2 hover ${
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
      {openMenu && (
        <MenuOptions
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          buttonRef={buttonRef}
        >
          {children}
        </MenuOptions>
      )}
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
      className="w-[200px] md:w-[200px] bg-gray-100 dark:bg-dark-2 absolute right-5 md:right-10 z-20 flex flex-col  rounded-md"
    >
      {children}
    </div>
  );
};
