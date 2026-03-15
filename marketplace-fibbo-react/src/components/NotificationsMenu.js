import { Icon } from "@iconify/react";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonTooltip } from "./tooltips/ButtonTooltip";
import { useStateContext } from "../context/StateProvider";

export const NotificationsMenu = ({
  setOpenMenu,
  notifications,
  removeNotification,
  buttonRef,
}) => {
  const ref = useRef(null);
  const [{ literals }] = useStateContext();
  const navigate = useNavigate();

  const redirectToItem = (notification) => {
    setOpenMenu(false);
    if (notification.collection.customURL !== "") {
      navigate(
        `/explore/${notification.collection.customURL}/${notification.tokenId}`
      );
    } else {
      navigate(
        `/explore/${notification.collectionAddress}/${notification.tokenId}`
      );
    }
  };

  const getNotificationText = (notification) => {
    let finalText = "";
    const { type, params } = notification;
    const paramsType = params.type;
    switch (type) {
      case "LISTING":
        if (paramsType === "FAV LISTED") {
          finalText = literals.notifications.favListed;
        } else if (paramsType === "COL LISTED") {
          finalText = literals.notifications.colListed;
        }
        break;
      case "OFFER":
        if (paramsType === "RECIEVED") {
          finalText = literals.notifications.itemOfferted;
        } else if (paramsType === "ACCEPTED") {
          finalText = literals.notifications.offerAccepted;
        } else if (paramsType === "EXPIRED") {
          finalText = literals.notifications.offerExpired;
        } else if (paramsType === "MODIFIED") {
          finalText = literals.notifications.offerModified;
        }
        break;
      case "TRANSFER":
        if (paramsType === "SOLD") {
          finalText = literals.notifications.itemSold;
        }
        break;
      case "AUCTION":
        if (paramsType === "BIDDED") {
          finalText = literals.notifications.itemBid;
        } else if (paramsType === "BID INCREASED") {
          finalText = literals.notifications.passedBid;
        } else if (paramsType === "WINNED") {
          finalText = literals.notifications.auctionWon;
        } else if (paramsType === "FINISHED") {
          finalText = literals.notifications.bidEnded;
        } else if (paramsType === "FAV AUCTION") {
          finalText = literals.notifications.favAuction;
        } else if (paramsType === "COL AUCTION") {
          finalText = literals.notifications.colAuction;
        } else if (paramsType === "FAV STARTED") {
          finalText = literals.notifications.favStarted;
        } else if (paramsType === "COL STARTED") {
          finalText = literals.notifications.colStarted;
        }
        break;
      default:
        break;
    }
    return finalText;
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
        className="w-[250px] md:w-[300px] bg-gray-100 dark:bg-dark-2 absolute  top-[60px] right-[50px] md:right-[200px]   z-20 flex flex-col  rounded-md"
      >
        <div className="p-2 border-b">
          {literals.notifications.notifications}
        </div>

        {notifications.length > 0 ? (
          <div className="flex flex-col gap-2">
            {notifications.map((notification) => {
              return (
                <NotificationsMenuItem
                  key={notification._id}
                  notification={notification}
                  removeNotification={() =>
                    removeNotification(notification._id)
                  }
                  getNotificationText={getNotificationText}
                  onClick={() => redirectToItem(notification)}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex text-gray-400 gap-2 p-2 items-center justify-between">
            {literals.notifications.noNotifications}
          </div>
        )}
      </div>
    </>
  );
};

const NotificationsMenuItem = ({
  notification,
  removeNotification,
  getNotificationText,
  onClick,
}) => {
  const { nftData, reciever } = notification;
  return (
    <div className="flex gap-2 p-2 items-center justify-between dark:hover:bg-dark-3 hover:bg-gray-300">
      <div onClick={onClick} className="flex gap-2 items-center">
        <div>
          <ButtonTooltip
            tooltip={`nft-${notification._id}`}
            tooltipPlacement="left"
            tooltipText={nftData.name}
          >
            <img
              width={48}
              src={nftData.image}
              className="rounded-full object-contain"
              alt={`nft-${notification._id}`}
            />
          </ButtonTooltip>
        </div>
        <div className="text-sm">{getNotificationText(notification)}</div>
      </div>
      <Icon
        width={20}
        onClick={removeNotification}
        className="cursor-pointer hover:scale-125 transition text-red-400"
        icon="fluent:delete-48-filled"
      />
    </div>
  );
};
