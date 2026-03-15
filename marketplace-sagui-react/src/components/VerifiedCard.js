import React from "react";
import { truncateWallet } from "../utils/wallet";

export const VerifiedCard = ({ avatar, username, wallet }) => {
  return (
    <div className="flex p-2 border rounded-md shadow-lg items-center gap-2">
      <div>
        <img
          className="rounded-full"
          src={avatar}
          width={64}
          height={64}
          alt={`${username}-verified`}
        />
      </div>
      <div className="flex flex-col">
        <div>{username}</div>
        <div className="text-gray-400">{truncateWallet(wallet, 6)}</div>
      </div>
    </div>
  );
};
