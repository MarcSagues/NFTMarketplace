import React from "react";
import useRespnsive from "../hooks/useResponsive";
import { truncateWallet } from "../utils/wallet";
import ActionButton from "./ActionButton";
import DropDown from "./DropDown";
import { useStateContext } from "../context/StateProvider";

export const ItemListings = ({ listings }) => {
  const { _width } = useRespnsive();
  const [{literals}] = useStateContext();
  return (
    <DropDown icon="ri:price-tag-2-fill" title="Listados">
      {_width > 1024 ? (
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-200 p-2">
            <tr className="p-2">
              <th scope="col" className="px-6 py-3">
                {literals.itemPage.listedFor}
              </th>
              <th cope="col" className="px-6 py-3">
                {literals.itemPage.price}
              </th>
              <th cope="col" className="px-6 py-3">
                {literals.itemPage.state}
              </th>
              <th cope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => {
              return (
                <tr key={Math.random(9999) * 1000}>
                  <td className="px-6 py-4">
                    {truncateWallet(listing.from, 5)}
                  </td>
                  <td className="px-6 py-4">{listing.price} FTM</td>
                  <td className="px-6 py-4">{listing.status}</td>
                  <td className="px-6 py-4">
                    <ActionButton text={literals.actions.buy} size="smaller" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col gap-10">
          {listings.map((listing) => {
            return (
              <tr key={Math.random(9999) * 1000}>
                <td className="px-6 py-4">{truncateWallet(listing.from, 5)}</td>
                <td className="px-6 py-4">{listing.price} FTM</td>
                <td className="px-6 py-4">{listing.status}</td>
                <td className="px-6 py-4">
                  <ActionButton text={literals.actions.buy} size="small" />
                </td>
              </tr>
            );
          })}
        </div>
      )}
    </DropDown>
  );
};
