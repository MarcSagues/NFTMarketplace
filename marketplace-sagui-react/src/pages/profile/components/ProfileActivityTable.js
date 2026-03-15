import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";

import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../api";
import { ADDRESS_ZERO } from "../../../constants/networks";
import { useStateContext } from "../../../context/StateProvider";
import useResponsive from "../../../hooks/useResponsive";
import { truncateWallet } from "../../../utils/wallet";

const eventTypes = [
  {
    _id: "SALE",
    label: "Ventas",
  },
  {
    _id: "TRANSFER",
    label: "Transfers",
  },
  {
    _id: "LISTING",
    label: "Listados",
  },
  {
    _id: "OFFER",
    label: "Ofertas",
  },
  {
    _id: "AUCTION",
    label: "Auctions",
  },
];

export default function ProfileActivityTable({ historyItems }) {
  const { _width } = useResponsive();
  const navigate = useNavigate();
  const [filteredItems, setFilteredItems] = useState(historyItems);
  const [filtersSelected, setFiltersSelected] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const filtersRef = useRef();
  const [{ literals }] = useStateContext();
  const { getCollectionInfo } = useApi();

  const filterByType = (type) => {
    let isSelected = filtersSelected.find((item) => item === type);
    if (isSelected) {
      setFiltersSelected(filtersSelected.filter((item) => item !== type));
    } else {
      setFiltersSelected([...filtersSelected, type]);
    }
  };

  const navigateToItem = async (item) => {
    const collectionInfo = await getCollectionInfo(item.item.collectionAddress);
    let finalURL = "";
    if (collectionInfo.customURL !== "") {
      finalURL = `/explore/${collectionInfo.customURL}/${item.item.tokenId}`;
    } else {
      finalURL = `/explore/${collectionInfo.contractAddress}/${item.item.tokenId}`;
    }

    if (isMobile) {
      navigate(finalURL);
    } else {
      window.open(finalURL, "_blank");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setOpenFilters(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filtersRef]);

  useEffect(() => {
    if (filtersSelected.length > 0) {
      let filtered = [];
      filtersSelected.forEach((filter) => {
        let result = historyItems.filter(
          (item) => item.eventType === filter._id
        );
        filtered = [...filtered, ...result];
      });
      filtered = filtered.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return -1;
        } else {
          return 1;
        }
      });
      setFilteredItems(filtered);
    } else {
      setFilteredItems(historyItems);
    }
  }, [filtersSelected]);

  return (
    <>
      <button
        onClick={() => setOpenFilters(!openFilters)}
        className="w-[200px] border dark:border-dark-4 px-6 py-3 font-bold text-lg rounded-lg dark:bg-dark-1 bg-gray-300 hover:dark:bg-dark-4 transition hover:bg-gray-400"
      >
        {literals.detailNFT.filterHistorial}
      </button>
      {openFilters && (
        <div
          ref={filtersRef}
          className="border dark:border-dark-2 w-[200px] bg-gray-100 dark:bg-dark-2  absolute  z-20 flex flex-col  rounded-md"
        >
          {eventTypes.map((type) => {
            return (
              <FilterItem
                type={type}
                onClick={filterByType}
                key={type._id}
                filtersSelected={filtersSelected}
              />
            );
          })}
        </div>
      )}
      <div className="mt-2 px-5 flex gap-2 flex-wrap md:flex-row justify-start items-center ">
        {filtersSelected.map((filter) => {
          return (
            <div
              key={Math.random(1, 999999)}
              onClick={() => filterByType(filter)}
              className="cursor-pointer text-xs md:text-sm  flex  items-center gap-2 dark:bg-dark-2 hover:bg-gray-200 hover:dark:bg-dark-4 border border-gray-200 rounded-xl px-8 py-3"
            >
              <div className="flex gap-2 items-center">{filter.label}</div>

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
      <div className="mt-4"></div>
      {_width > 1024 ? (
        <div
          className={`${
            filteredItems.length >= 10 && "h-[375px] overflow-y-scroll"
          }`}
        >
          <table className="w-full text-left table-auto ">
            <thead className="bg-gray-200 dark:bg-dark-3 p-2">
              <tr className="p-2">
                <th scope="col" className="px-6 py-3">
                  {literals.itemHistory.event}
                </th>
                <th cope="col" className="px-6 py-3">
                  {literals.itemHistory.item}
                </th>
                <th cope="col" className="px-6 py-3">
                  {literals.itemHistory.price}
                </th>
                <th cope="col" className="px-6 py-3">
                  {literals.itemHistory.initiator}
                </th>
                <th cope="col" className="px-6 py-3">
                  {literals.itemHistory.recipient}
                </th>
                <th cope="col" className="px-6 py-3">
                  {literals.itemHistory.date}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems?.map((item) => {
                return (
                  <tr key={Math.random(9999) * 1000}>
                    <td className="px-6 py-4">{item.eventDesc}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        {item.item?.image && (
                          <img
                            className="rounded-full"
                            width={32}
                            src={item.item?.image}
                            alt={`from-${item._id}-img`}
                          />
                        )}
                        <p
                          className="text-primary-2 underline cursor-pointer"
                          onClick={() => navigateToItem(item)}
                        >
                          {item.item?.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.price !== 0 ? (
                        <div className="flex items-center gap-3">
                          <img src={item.payToken?.image} width={26} />
                          <div className="text-lg">{item.price}</div>
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.from === ADDRESS_ZERO ? (
                        truncateWallet(item.from, 4)
                      ) : (
                        <div className="flex gap-2 items-center">
                          <img
                            className="rounded-full"
                            width={32}
                            src={item.from.profileImg}
                            alt={`from-${item.from._id}-img`}
                          />
                          <p
                            className="text-primary-2 underline cursor-pointer"
                            onClick={() => navigateToItem(item)}
                          >
                            {item.from.username}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.to === ADDRESS_ZERO ? (
                        truncateWallet(item.to, 4)
                      ) : (
                        <div className="flex gap-2 items-center">
                          <img
                            className="rounded-full"
                            width={32}
                            src={item.to?.profileImg}
                            alt={`from-${item.to?._id}-img`}
                          />
                          <p
                            className="text-primary-2 underline cursor-pointer"
                            onClick={() =>
                              isMobile
                                ? navigate(`/account/${item.from?.wallet}`)
                                : window.open(
                                    `/account/${item.to?.wallet}`,
                                    "_blank"
                                  )
                            }
                          >
                            {item.to?.username}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={`${
            filteredItems.length >= 10 && "h-[375px] overflow-y-scroll"
          }`}
        >
          <div className="flex flex-col gap-10">
            {filteredItems?.map((item) => {
              return (
                <div
                  key={Math.random(9999) * 100}
                  className="flex flex-col gap-3 bg-gray-100 dark:bg-dark-3 p-3 hover:bg-gray-300"
                >
                  <div className="flex justify-between">
                    <div>
                      <b>{literals.itemHistory.event}</b>
                    </div>
                    <div>{item.eventDesc}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <b>{literals.itemHistory.item}</b>
                    </div>
                    <div>
                      <div className="flex gap-2 items-center">
                        {item.item?.image && (
                          <img
                            className="rounded-full"
                            width={32}
                            src={item.item?.image}
                            alt={`from-${item._id}-img`}
                          />
                        )}
                        <p
                          className="text-primary-2 underline cursor-pointer"
                          onClick={() =>
                            isMobile
                              ? navigate(
                                  `/explore/${item.item?.collectionAddress}/${item.item.tokenId}`
                                )
                              : window.open(
                                  `/explore/${item.item?.collectionAddress}/${item.item.tokenId}`,
                                  "_blank"
                                )
                          }
                        >
                          {item.item?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <b>{literals.detailNFT.price}</b>
                    </div>
                    <div>
                      {" "}
                      {item.price !== 0 ? (
                        <div className="flex items-center gap-3">
                          <img src={item.payToken?.image} width={26} />
                          <div className="text-lg">{item.price}</div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <b>{literals.itemHistory.initiator}</b>
                    </div>
                    <div>
                      {item.from === ADDRESS_ZERO ? (
                        truncateWallet(item.from, 4)
                      ) : (
                        <div className="flex gap-2 items-center">
                          <img
                            className="rounded-full"
                            width={32}
                            src={item.from.profileImg}
                            alt={`from-${item.from._id}-img`}
                          />
                          <p
                            className="text-primary-2 underline cursor-pointer"
                            onClick={() =>
                              window.open(
                                `/account/${item.from.wallet}`,
                                "_blank"
                              )
                            }
                          >
                            {item.from.username}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <b>{literals.itemHistory.recipient}</b>
                    </div>
                    <div>
                      {item.to === ADDRESS_ZERO ? (
                        truncateWallet(item.to, 4)
                      ) : (
                        <div className="flex gap-2 items-center">
                          <img
                            className="rounded-full"
                            width={32}
                            src={item.to?.profileImg}
                            alt={`from-${item.to?._id}-img`}
                          />
                          <p
                            className="text-primary-2 underline cursor-pointer"
                            onClick={() =>
                              window.open(
                                `/account/${item.to?.wallet}`,
                                "_blank"
                              )
                            }
                          >
                            {item.to?.username}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <b>{literals.itemHistory.date}</b>
                    </div>
                    <div> {new Date(item.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

const FilterItem = ({ type, onClick, filtersSelected }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(!isSelected);
    onClick(type);
  };
  useEffect(() => {
    let item = filtersSelected.find((filter) => filter._id === type._id);

    setIsSelected(item ? true : false);
  }, [filtersSelected]);
  return (
    <div
      onClick={() => handleSelect()}
      className={`cursor-pointer font-bold px-6 py-4 hover:dark:bg-dark-4 ${
        isSelected && "dark:bg-dark-4"
      } `}
    >
      {type.label}
    </div>
  );
};
