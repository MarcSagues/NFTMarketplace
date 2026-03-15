import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateProvider";
import SearchResultItem from "./SearchResultItem";

export default function SearchResult({
  itemsResult,
  profilesResult,
  collectionsResult,
  setInputValue,
  setSearchResult,
  setOpenSearchResult,
}) {
  const ref = useRef(null);
  const [{ literals }] = useStateContext();
  const navigate = useNavigate();
  const goToItemDetail = (item) => {
    navigate(`/explore/${item.collectionAddress}/${item.tokenId}`);
    setInputValue("");
    setSearchResult.items([]);
    setSearchResult.profiles([]);
    setSearchResult.collections([]);
  };

  const goToProfileDetail = (item) => {
    navigate(`/account/${item.wallet}`);
    setInputValue("");
    setSearchResult.items([]);
    setSearchResult.profiles([]);
    setSearchResult.collections([]);
  };

  const goToCollectionDetail = (item) => {
    if (item.customURL) {
      navigate(`/collection/${item.customURL}`);
    } else {
      navigate(`/collection/${item.contractAddress}`);
    }

    setInputValue("");
    setSearchResult.items([]);
    setSearchResult.profiles([]);
    setSearchResult.collections([]);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenSearchResult(false);
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
      className="overflow-y-scroll h-[700px] dark:bg-gray-700 absolute z-99 flex flex-col bg-white w-[300px]  md:w-[400px] border border-gray"
    >
      <div className="dark:bg-dark-3 uppercase cursor-pointer flex items-center px-2 py-1 gap-3 bg-gray-100 border-b ">
        <div>{literals.navbar.nfts}</div>
      </div>
      {itemsResult.map((item) => {
        return (
          <SearchResultItem
            onClick={(e) => goToItemDetail(item)}
            key={Math.random(999999) * 1000}
            image={item.image}
            text={item.name}
          />
        );
      })}
      <div className="dark:bg-dark-3 uppercase cursor-pointer flex items-center px-2 py-1 gap-3 bg-gray-100 border-b ">
        <div>{literals.navbar.collections}</div>
      </div>
      {collectionsResult.map((item) => {
        return (
          <SearchResultItem
            onClick={(e) => goToCollectionDetail(item)}
            key={Math.random(999999) * 1000}
            image={item.logoImage}
            text={item.name}
          />
        );
      })}
      <div className="dark:bg-dark-3 uppercase cursor-pointer flex items-center px-2 py-1 gap-3 bg-gray-100 border-b ">
        <div>{literals.navbar.profiles}</div>
      </div>
      {profilesResult.map((item) => {
        return (
          <SearchResultItem
            onClick={(e) => goToProfileDetail(item)}
            key={Math.random(999999) * 1000}
            image={item.profileImg}
            text={item.username}
          />
        );
      })}
    </div>
  );
}
