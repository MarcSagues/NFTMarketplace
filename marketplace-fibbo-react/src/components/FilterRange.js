import React from "react";
import {useStateContext} from "../context/StateProvider";

export default function FilterRange({
  min_state,
  max_state,
  setMinState,
  setMaxState,
  applyFilter,
}) {
  const [{literals}] = useStateContext();
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full border-t p-1  border-black bg-[#E3DEFC] ">
      <div className="flex flex-row justify-center items-center w-full gap-3 p-2">
        <div className="relative mt-2 flex-row text-black">
          <input
            size="10"
            placeholder="Min"
            min="0"
            type="number"
            className="p-1 w-28 border  text-center  input-field border-2 focus:border-2 rounded"
            value={min_state}
            onChange={(e) => setMinState(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center">
            <img
              width={28}
              src="https://assets.trustwalletapp.com/blockchains/fantom/info/logo.png"
              alt="Fantom coin"
              className="m-0.5"
            />
          </div>
        </div>
        <h1 className="text-black font-semibold m-1">-</h1>

        <div className="relative mt-2 flex-row text-black">
          <input
            size="10"
            type="number"
            placeholder="Max"
            className="p-1 w-28  input-field border text-center rounded"
            value={max_state}
            onChange={(e) => setMaxState(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center">
            {" "}
            <img
              width={28}
              src="https://assets.trustwalletapp.com/blockchains/fantom/info/logo.png"
              alt="Fantom coin"
              className="m-0.5"
            />
          </div>
        </div>
      </div>
      <button
        className="flex items-center bg-purple-600 text-white font-bold py-2 px-4 rounded justify-center border border-gray-300 hover:bg-[#B27FF7]"
        onClick={(e) => applyFilter()}
      >
        {literals.actions.filter}
      </button>
    </div>
  );
}
