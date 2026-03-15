import React from "react";
import DropDown from "./DropDown";
import { useNavigate } from "react-router-dom";
import NftCard from "./NftCard";
import { useStateContext } from "../context/StateProvider";

export const MoreItems = ({ nfts, collectionInfo, wallet }) => {
  const navigate = useNavigate();
  const [{ literals }] = useStateContext();
  const redirectToItem = (item) => {
    navigate(
      `/explore/${
        collectionInfo.customURL
          ? collectionInfo.customURL
          : item.collectionAddress
      }/${item.tokenId}`,
      { replace: true }
    );
  };

  return (
    <DropDown
      opened={true}
      className={`mb-5 dark:bg-dark-2`}
      icon="ri:price-tag-2-fill"
      title={literals.itemPage.moreCollection}
    >
      <div className={`${" overflow-x-scroll"}`}>
        <div className="flex flex-row gap-3">
          {nfts?.map((item) => {
            return (
              <NftCard
                wallet={wallet}
                key={item.tokenId}
                isSmall={true}
                item={{ ...item, collection: collectionInfo }}
                onClick={() => redirectToItem(item)}
              />
            );
          })}
        </div>
      </div>
    </DropDown>
  );
};
