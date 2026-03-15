import React, { useEffect, useState } from "react";
import NftCard from "../../components/NftCard";
import { Icon } from "@iconify/react";

import InfiniteScroll from "react-infinite-scroll-component";
import { useApi } from "../../api";
import FiltersSidebar from "../../components/FiltersSidebar";
import useAccount from "../../hooks/useAccount";
import { useNavigate } from "react-router-dom";

import { PageWithLoading } from "../../components/basic/PageWithLoading";
import useResponsive from "../../hooks/useResponsive";
import { FiltersSidebarModal } from "../../components/modals/FiltersSidebarModal";
import fibboLogo from "../../assets/logoNavbarSmall.png";
import {
  orderByHighestP,
  orderByLowestP,
  orderByNearestEnd,
  orderByOldest,
  orderByOldestListed,
  orderByRecently,
  orderByRecentlyListed,
  sortMarketItems,
} from "../../utils/sort";
import { useStateContext } from "../../context/StateProvider";
import { ButtonTooltip } from "../../components/tooltips/ButtonTooltip";

export default function ExploreContainer() {
  const [{ lang, literals }] = useStateContext();
  const navigate = useNavigate();
  const {
    getAllTokens,
    getAllPayTokens,
    getCollectionsAvailable,
    getAllCategories,
  } = useApi();
  const { wallet } = useAccount();
  const [marketItems, setMarketItems] = useState([]);
  const [allMarketItems, setAllMarketItems] = useState([]);
  const [visibleMarketItems, setVisibleMarketItems] = useState([]);
  const { _width } = useResponsive();
  const [visibleItemsCount, setVisibleItemsCount] = useState(12);
  const [userSmallview, setSmallViewUser] = useState(false);
  const [openedSidebar, setOpenedSidebar] = useState(true);
  const [filtersSelected, setFiltersSelected] = useState([]);
  const [sortSelected, setSortSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const [allCollections, setAllCollections] = useState([]);
  const [allErc20Tokens, setAllErc20Tokens] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingInfo(true);
      setOpenedSidebar(_width < 900 ? false : true);
      const _payTokens = await getAllPayTokens();
      setAllErc20Tokens(_payTokens);

      const _collections = await getCollectionsAvailable();

      setAllCollections(_collections);

      let forSaleItems = await getAllTokens(wallet);
      forSaleItems = forSaleItems.sort(orderByRecently);

      setAllMarketItems(forSaleItems);
      setMarketItems(forSaleItems);

      const cats = await getAllCategories();

      setAllCategories(cats);
      setVisibleMarketItems(forSaleItems.slice(0, 12));
      setLoading(false);
    };
    fetchData();
    setLoadingInfo(false);
  }, [wallet]);

  const addMoreItems = () => {
    const newCount = visibleItemsCount + 12;
    const marketItems = visibleMarketItems.concat(
      allMarketItems.slice(visibleItemsCount, newCount)
    );
    setVisibleItemsCount(newCount);
    setVisibleMarketItems(marketItems);
  };

  const goToNftDetail = (item) => {
    navigate(
      `/explore/${
        item.collection.customURL
          ? item.collection.customURL
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

  const sortItems = (value) => {
    setSortSelected(value);
    if (value === "2") {
      //recentyl created

      const sortedArray = allMarketItems.sort(orderByRecently);
      const visibledsortedArray = visibleMarketItems.sort(orderByRecently);
      setAllMarketItems(sortedArray);
      setVisibleMarketItems(visibledsortedArray.slice(0, visibleItemsCount));
    }
    if (value === "3") {
      //oldest created
      const sortedArray = allMarketItems.sort(orderByOldest);
      const visibledsortedArray = visibleMarketItems.sort(orderByOldest);
      setAllMarketItems(sortedArray);
      setVisibleMarketItems(visibledsortedArray.slice(0, visibleItemsCount));
    }
    if (value === "4") {
      let toSortAll = [];
      const forSaleAll = allMarketItems.filter(
        (item) => item.price !== undefined
      );
      const auctionAll = allMarketItems.filter(
        (item) => item.auction !== undefined
      );
      let leftItemsAll = allMarketItems.filter((item) => {
        return !forSaleAll.find((forSaleItem) => forSaleItem === item);
      });
      leftItemsAll = leftItemsAll.filter((item) => {
        return !auctionAll.find((auctioned) => auctioned === item);
      });

      toSortAll = [...forSaleAll, ...auctionAll];

      const sortedArrayAll = toSortAll.sort(orderByRecentlyListed);

      let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

      setAllMarketItems(finalArrayAll);
      setVisibleMarketItems(finalArrayAll.slice(0, visibleItemsCount));
    }
    if (value === "5") {
      //Lowest price
      let toSortAll = [];
      const forSaleAll = allMarketItems.filter(
        (item) => item.price !== undefined
      );
      const auctionAll = allMarketItems.filter(
        (item) => item.auction !== undefined
      );
      let leftItemsAll = allMarketItems.filter((item) => {
        return !forSaleAll.find((forSaleItem) => forSaleItem === item);
      });
      leftItemsAll = leftItemsAll.filter((item) => {
        return !auctionAll.find((auctioned) => auctioned === item);
      });

      toSortAll = [...forSaleAll, ...auctionAll];

      const sortedArrayAll = toSortAll.sort(orderByOldestListed);

      let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

      setAllMarketItems(finalArrayAll);
      setVisibleMarketItems(finalArrayAll.slice(0, visibleItemsCount));
    }
    if (value === "6") {
      //highest price
      let toOrderAll = [];
      const forSaleAll = allMarketItems.filter(
        (item) => item.price !== undefined
      );
      const offeredAll = allMarketItems.filter(
        (item) => item.offer !== undefined
      );
      const auctionAll = allMarketItems.filter(
        (item) => item.auction !== undefined
      );

      toOrderAll = [...forSaleAll, ...offeredAll, ...auctionAll];

      let leftItemsAll = allMarketItems.filter((item) => {
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

      setAllMarketItems(finalArrayAll);
      setVisibleMarketItems(finalArrayAll.slice(0, visibleItemsCount));
    }
    if (value === "7") {
      let toOrderAll = [];
      const forSaleAll = allMarketItems.filter(
        (item) => item.price !== undefined
      );
      const offeredAll = allMarketItems.filter(
        (item) => item.offer !== undefined
      );
      const auctionAll = allMarketItems.filter(
        (item) => item.auction !== undefined
      );

      toOrderAll = [...forSaleAll, ...offeredAll, ...auctionAll];

      let leftItemsAll = allMarketItems.filter((item) => {
        return !forSaleAll.find((forSaleItem) => forSaleItem === item);
      });
      leftItemsAll = leftItemsAll.filter((item) => {
        return !offeredAll.find((offered) => offered === item);
      });
      leftItemsAll = leftItemsAll.filter((item) => {
        return !auctionAll.find((auctioned) => auctioned === item);
      });

      const sortedArrayAll = toOrderAll.sort(orderByLowestP);

      let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

      setAllMarketItems(finalArrayAll);
      setVisibleMarketItems(finalArrayAll.slice(0, visibleItemsCount));
    }
    if (value === "8") {
      const auctionsAll = allMarketItems.filter(
        (item) => item.auction !== undefined
      );
      const leftItemsAll = allMarketItems.filter((item) => {
        return !auctionsAll.find((auction) => auction === item);
      });

      const sortedArrayAll = auctionsAll.sort(orderByNearestEnd);

      let finalArrayAll = sortedArrayAll.concat(leftItemsAll);

      setAllMarketItems(finalArrayAll);
      setVisibleMarketItems(finalArrayAll.slice(0, visibleItemsCount));
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
      if (filter.collection) {
        removeCollectionFilter(filter);
      } else {
        //selectPayTokenFilter(filter);
        if (filter.category) {
          removeCategoryFilter(filter);
        }
        if (filter.favorites) {
          removeFavoriteFilter(filter);
        }
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
      setVisibleMarketItems(allMarketItems);
      setFiltersSelected(
        filtersSelected.filter(
          (item) => item.contractAddress !== token.contractAddress
        )
      );
    } else {
      setFiltersSelected([...filtersSelected, token]);
    }
  };

  const selectCollection = (collectionItem) => {
    let isSelected = filtersSelected.find(
      (item) => item.collection === collectionItem.contractAddress
    );

    if (isSelected) {
      setVisibleMarketItems(allMarketItems);
      setFiltersSelected(
        filtersSelected.filter(
          (item) => item.collection !== collectionItem.contractAddress
        )
      );
    } else {
      setFiltersSelected([
        ...filtersSelected,
        {
          collection: collectionItem.contractAddress,
          name: collectionItem.name,
        },
      ]);
    }
  };

  const removeCollectionFilter = (collectionItem) => {
    let isSelected = filtersSelected.find(
      (item) => item.collection === collectionItem.collection
    );
    if (isSelected) {
      setVisibleMarketItems(allMarketItems);
      setFiltersSelected(
        filtersSelected.filter(
          (item) => item.collection !== collectionItem.collection
        )
      );
    }
  };

  const selectCategory = (categoryItem) => {
    const categoryName =
      lang === "eng" ? categoryItem.name.eng : categoryItem.name.esp;
    let isSelected = filtersSelected.find(
      (item) => item.category === categoryName
    );

    if (isSelected) {
      setVisibleMarketItems(allMarketItems);
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
      setVisibleMarketItems(allMarketItems);
      setFiltersSelected(
        filtersSelected.filter((item) => item.category !== categoryItem.name)
      );
    }
  };
  const removeFavoriteFilter = (filter) => {
    let isSelected = filtersSelected.find((item) => item.favorites === true);
    if (isSelected) {
      setVisibleMarketItems(allMarketItems);
      setFiltersSelected(
        filtersSelected.filter((item) => item.favorites !== true)
      );
    }
  };

  useEffect(() => {
    //Status Filter
    if (filtersSelected.length > 0) {
      let filtered = [];
      filtersSelected.forEach((filter) => {
        if (filter === literals.filters.onSale) {
          let result = marketItems.filter((item) => item.price !== undefined);
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.offered) {
          let result = marketItems.filter((item) => item.offer !== undefined);
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.onAuction) {
          let result = marketItems.filter((item) => item.auction !== undefined);
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.hasBids) {
          let result = marketItems.filter(
            (item) => item.auction?.topBid !== undefined
          );
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.image) {
          let result = marketItems.filter((item) => item.contentType === "IMG");
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.video) {
          let result = marketItems.filter(
            (item) => item.contentType === "VIDEO"
          );
          filtered = [...filtered, ...result];
        }
        if (filter === literals.filters.audio) {
          let result = marketItems.filter(
            (item) => item.contentType === "AUDIO"
          );
          filtered = [...filtered, ...result];
        }
        if (filter.collection) {
          let _result = [];
          _result = marketItems.filter(
            (item) => item.collectionAddress === filter.collection
          );
          filtered = [...filtered, ..._result];
        }
        if (filter.category) {
          let _result = [];
          _result = marketItems.filter((item) =>
            item.categories?.includes(filter.identifier)
          );
          filtered = [...filtered, ..._result];
        }
        if (filter.favorites) {
          let _result = [];
          _result = marketItems.filter((item) => item.isFavorited === true);
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

      if (sortSelected !== 0 && sortSelected !== 1) {
        finalFiltered = sortMarketItems(sortSelected, finalFiltered);
      }
      setAllMarketItems(finalFiltered);
      setVisibleMarketItems(finalFiltered.slice(0, 12));
    } else {
      let finalFiltered = marketItems;
      if (sortSelected !== 0 && sortSelected !== 1) {
        finalFiltered = sortMarketItems(sortSelected, marketItems);
      }

      setAllMarketItems(finalFiltered);
      setVisibleMarketItems(finalFiltered.slice(0, 12));
    }
  }, [filtersSelected]);

  return (
    <PageWithLoading loading={loading}>
      <>
        <>
          {_width > 900 && (
            <FiltersSidebar
              filtersSelected={filtersSelected}
              openedSidebar={openedSidebar}
              setFiltersSelected={setFiltersSelected}
              setOpenedSidebar={setOpenedSidebar}
              allMarketItems={allMarketItems}
              setAllMarketItems={setAllMarketItems}
              visibleMarketItems={visibleMarketItems}
              setVisibleMarketItems={setVisibleMarketItems}
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
              collections={allCollections}
              selectCollection={selectCollection}
              selectCategory={selectCategory}
            />
          )}
          <div
            className={`flex flex-col ${
              openedSidebar ? "ml-[20vw]" : "ml-[5vw]"
            }`}
          >
            <div
              className={`flex flex-col ${
                openedSidebar
                  ? "items-start "
                  : `${_width > 900 && "ml-20"} items-center`
              }`}
            >
              <div className="mt-2 ml-5 px-5 flex flex-row justify-evenly md:justify-center w-full items-center gap-2 md:gap-5 dark:bg-dark-1  ">
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
                {/*  <div>
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
                  className="cursor-pointer h-10 w-40 md:w-60 flex border border-gray-300 bg-white dark:bg-dark-1 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => sortItems(e.target.value)}
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
                <div className="flex flex-row items-center justify-center gap-2 md:gap-5 ">
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
                    className="hover:-translate-y-1"
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
                          {filter.image && (
                            <img src={filter.image} width={24} />
                          )}
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
                    {literals.filters.clearAll}
                  </div>
                )}
              </div>
            </div>

            {!loadingInfo ? (
              <InfiniteScroll
                className="flex  mt-2 flex-wrap justify-center"
                dataLength={visibleMarketItems.length}
                next={addMoreItems}
                hasMore={true}
              >
                {visibleMarketItems.map((item) => {
                  return (
                    <div key={Math.random(1, 9999)} className="p-5">
                      <NftCard
                        onClick={() => goToNftDetail(item)}
                        isSmall={userSmallview}
                        item={item}
                        wallet={wallet}
                      />
                    </div>
                  );
                })}
              </InfiniteScroll>
            ) : (
              <div className="w-screen h-[50vh] animate-pulse flex items-center justify-center">
                <img src={fibboLogo} className="w-[128px] animate-spin" />
              </div>
            )}
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
              collections={allCollections}
              selectCollection={selectCollection}
              selectCategory={selectCategory}
            />
          )}
        </>
      </>
    </PageWithLoading>
  );
}
