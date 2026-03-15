import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../api";
import { useStateContext } from "../../../context/StateProvider";

import useResponsive from "../../../hooks/useResponsive";

export const ProfileBidsTable = ({ bids }) => {
  const { _width } = useResponsive();
  const navigate = useNavigate();
  const { getCollectionInfo } = useApi();
  const [{ literals }] = useStateContext();
  const formatDate = (bid) => {
    const now = new Date().getTime();
    const deadline = bid.auction.endTime;

    const date = new Date(deadline * 1000).toLocaleString();

    const isExpired = now > new Date(deadline * 1000).getTime();
    return isExpired ? "EXPIRED" : date;
  };

  const navigateToItem = async (bid) => {
    const collectionInfo = await getCollectionInfo(bid.collectionAddress);
    let finalURL = "";
    if (collectionInfo.customURL !== "") {
      finalURL = `/explore/${collectionInfo.customURL}/${bid.item.tokenId}`;
    } else {
      finalURL = `/explore/${collectionInfo.contractAddress}/${bid.item.tokenId}`;
    }

    if (isMobile) {
      navigate(finalURL);
    } else {
      window.open(finalURL, "_blank");
    }
  };

  return (
    <>
      {_width > 1024 ? (
        <>
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-200 dark:bg-dark-3 p-2">
              <tr className="p-2">
                <th scope="col" className="px-6 py-3">
                  {literals.itemHistory.item}
                </th>

                <th cope="col" className="px-6 py-3">
                  {literals.profile.biddedFor}
                </th>
                <th cope="col" className="px-6 py-3">
                  {literals.profile.endsAt}
                </th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => {
                return (
                  <tr key={Math.random(9999) * 1000}>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        <img
                          className="rounded-full"
                          width={32}
                          src={bid.item.image}
                          alt={`from-${bid._id}-img`}
                        />
                        <p
                          className="text-primary-2 underline cursor-pointer"
                          onClick={() => navigateToItem(bid)}
                        >
                          {bid.item.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {" "}
                      <div className="flex items-center gap-3">
                        <img src={bid.payToken?.image} width={26} />
                        <div className="text-lg">{bid.bid}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{formatDate(bid)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <div className="flex flex-col gap-10">
          {bids.map((bid) => {
            return (
              <div
                key={Math.random(9999) * 100}
                className="flex flex-col gap-3 bg-gray-100 dark:bg-dark-3 p-3 hover:bg-gray-300"
              >
                <div className="flex justify-between">
                  <div>
                    <b>Item</b>
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <img
                        className="rounded-full"
                        width={32}
                        src={bid.item.image}
                        alt={`from-${bid._id}-img`}
                      />
                      <p
                        className="text-primary-2 underline cursor-pointer"
                        onClick={() => navigateToItem(bid)}
                      >
                        {bid.item.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <b>{literals.profile.biddedFor}</b>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <img src={bid.payToken?.image} width={26} />
                      <div className="text-lg">{bid.bid}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <b>{literals.profile.endsAt}</b>
                  </div>
                  <div>{formatDate(bid)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
