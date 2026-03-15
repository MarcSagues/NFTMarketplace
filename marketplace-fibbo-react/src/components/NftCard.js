import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useApi } from "../api";
import { useStateContext } from "../context/StateProvider";
import { ButtonTooltip } from "./tooltips/ButtonTooltip";
export default function NftCard({ item, onClick, isSmall, wallet }) {
  const [{ literals }] = useStateContext();
  const { addFavorite, deleteFavorite } = useApi();

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const formatDate = () => {
    const now = new Date();
    const auctionInfo = item.auction;
    const startTimeStamp = Math.floor(now.getTime() / 1000);
    const endTimestamp = auctionInfo.endTime;
    let period = endTimestamp - startTimeStamp;
    if (now.getTime() <= auctionInfo?.startTime) {
      period = auctionInfo?.startTime * 1000 - Math.floor(now.getTime());

      const days = Math.round(period / 3600 / 24);
      if (days === 0) {
        const hours = Math.round(period / 3600);
        if (hours === 0) {
          const minutes = Math.round(period / 60);
          return `${literals.detailNFT.starts} ${minutes} ${
            minutes > 1 ? literals.detailNFT.minutes : literals.detailNFT.minute
          }`;
        } else {
          return `${literals.detailNFT.starts} ${hours} ${
            hours > 1 ? literals.detailNFT.hours : literals.detailNFT.hour
          }`;
        }
      } else {
        return `${literals.detailNFT.starts} ${days} ${
          days > 1 ? literals.detailNFT.days : literals.detailNFT.day
        }`;
      }
    } else {
      const days = Math.round(period / 3600 / 24);
      if (days === 0) {
        const hours = Math.round(period / 3600);
        if (hours === 0) {
          const minutes = Math.round(period / 60);
          return `${literals.detailNFT.endsIn} ${minutes} ${
            minutes > 1 ? literals.detailNFT.minutes : literals.detailNFT.minute
          }`;
        } else {
          return `${literals.detailNFT.endsIn} ${hours} ${
            hours > 1 ? literals.detailNFT.hours : literals.detailNFT.hour
          }`;
        }
      } else {
        return `${literals.detailNFT.endsIn} ${days} ${
          days > 1 ? literals.detailNFT.days : literals.detailNFT.day
        }`;
      }
    }
  };

  useEffect(() => {
    setLiked(item.isFavorited);
    setLikes(item.favorites);
  }, [item]);

  const toggleFavorite = async () => {
    if (liked) {
      await deleteFavorite(item.collectionAddress, item.tokenId, wallet);
      setLiked(false);
      setLikes(likes - 1);
    } else {
      await addFavorite(item.collectionAddress, item.tokenId, wallet);
      setLiked(true);
      setLikes(likes + 1);
    }
  };
  return (
    <div className="flex flex-col gap-3 shadow-lg bg-gray-200 dark:border-dark-2 dark:bg-dark-3 border-gray-30  shadow-gray-300 dark:shadow-dark-4   border-2 p-3 rounded-md cursor-pointer hover:shadow-lg hover:border-3 hover:-translate-y-1">
      {wallet && wallet !== "" && (
        <div className="w-full flex gap-2 items-end justify-end text-gray-400">
          <ButtonTooltip
            tooltip={`favorite-${item.tokenId}-${item.collection.contractAddress}`}
            tooltipText={
              liked
                ? literals.detailNFT.unFavorite
                : literals.detailNFT.favorite
            }
            tooltipPlacement="left"
            onClick={toggleFavorite}
            className="flex flex-row gap-2"
          >
            <Icon
              icon={liked ? "carbon:favorite-filled" : "carbon:favorite"}
              width={22}
              className="hover:text-primary-2"
            />
            {likes}
          </ButtonTooltip>
        </div>
      )}
      <div
        onClick={onClick}
        className={`${
          isSmall ? "h-[212px] w-[212px]" : "h-[322px] w-[322px]"
        } flex pb-3 border-b-2 border-gray-700 dark:border-gray-300 `}
      >
        {item.contentType === "VIDEO" ? (
          <>
            {item.image ? (
              <img
                className="object-contain w-full h-full"
                src={item.nft ? item.nft.image : item.image}
                alt={item.name}
              />
            ) : (
              <video src={item.video} />
            )}
          </>
        ) : (
          <img
            className="object-contain w-full h-full"
            src={item.nft ? item.nft.image : item.image}
            alt={item.name}
          />
        )}
      </div>
      <div
        onClick={onClick}
        className="flex justify-between gap-2 items-center"
      >
        <div className="flex flex-col justify-center pt-2 gap-1 pb-1">
          <p className="text-xs text-gray-400">
            <i>{item.collection?.name}</i>
          </p>
          <p className="flex gap-2 items-center">
            <b>{item.name}</b>
            {item.contentType === "IMG" && <Icon icon="bi:file-image" />}
            {item.contentType === "AUDIO" && <Icon icon="bi:file-music" />}
            {item.contentType === "VIDEO" && <Icon icon="bi:camera-video" />}
          </p>
        </div>
        {item.price && (
          <div className="pt-2 pb-1 flex flex-col gap-1 items-end">
            <p className="text-xs text-gray-400">
              <i>{literals.detailNFT.price}</i>
            </p>
            <div className="flex gap-2 items-center">
              <img src={item?.payToken?.image} width={22} />
              <div>{item.price} </div>
            </div>
          </div>
        )}
        {item.offer && !item.price && (
          <div className="pt-2 pb-1 flex flex-col gap-1 items-end">
            <p className="text-xs text-gray-400">
              <i>{literals.detailNFT.price}</i>
            </p>
            <div className="flex gap-2 flex gap-2 items-center">
              <div
                className={`text-sm ${
                  isSmall && "text-xs"
                } text-gray-500 dark:text-gray-300`}
              >
                {isSmall
                  ? literals.detailNFT.offerOf
                  : literals.detailNFT.offerOf}
              </div>
              <img src={item?.offer?.payToken.image} width={22} />
              <div>{item.offer.price} </div>
            </div>
          </div>
        )}
        {item.auction && (
          <div className="pt-2 pb-1 flex flex-col gap-1 items-end">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item?.auction.topBid ? (
                <i>{literals.detailNFT.maximumBid}</i>
              ) : (
                <i>{literals.detailNFT.minimumBid}</i>
              )}
            </p>
            <div className="flex gap-2 flex gap-2 items-center">
              <img src={item?.auction.payToken.image} width={22} />
              <div>
                {item?.auction.topBid
                  ? item?.auction.topBid
                  : item?.auction.bid}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
