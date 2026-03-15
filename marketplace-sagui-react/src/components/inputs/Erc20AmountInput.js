import CoinGecko from "coingecko-api";
import React, { useEffect } from "react";
import { useState } from "react";
import { useApi } from "../../api/index";
import { Icon } from "@iconify/react";
import { useWFTMContract } from "../../contracts/wftm";
import useAccount from "../../hooks/useAccount";
import { formatEther } from "ethers/lib/utils";
import useProvider from "../../hooks/useProvider";
export const Erc20AmountInput = ({
  label,
  value,
  onChange,
  error,
  errorMessage,
  selectedToken,
  selectDisabled,
  setSelectedToken = true,
  showBalance,
  nonSelect,
}) => {
  const { getAllPayTokens } = useApi();
  const { getTotalFTMBalance } = useWFTMContract();
  const { wallet } = useAccount();
  const [coinPrice, setCoinPrice] = useState(0);
  const [payTokens, setPayTokens] = useState([]);
  const [openSelect, setOpenSelect] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0.000");
  const formatPrice = (value) => {
    let price = value * coinPrice;
    if (!value) {
      return "$0.00";
    }
    return "$" + price.toFixed(2).toString();
  };

  const handleSelectPayToken = async (token) => {
    setSelectedToken(token);
    if (token.name === "FTM") {
      const wftBalance = await getTotalFTMBalance(wallet);

      setTokenBalance(wftBalance);
    }
    setOpenSelect(false);
  };

  const handleChange = (value) => {
    if (value.includes(".") || value.includes(",")) {
      let numberOfDecimals = 0;
      if (value.includes(".")) {
        numberOfDecimals = value.split(".")[1].length;
      } else if (value.includes(",")) {
        numberOfDecimals = value.split(",")[1].length;
      }
      if (numberOfDecimals > 2) {
        onChange(parseFloat(value).toFixed(2));
      } else {
        onChange(value);
      }
    } else {
      onChange(value);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let _payTokens = await getAllPayTokens();
      setPayTokens(_payTokens);
      setSelectedToken(_payTokens[0]);
      if (_payTokens[0].name === "FTM") {
        const balance = await getTotalFTMBalance(wallet);
        setTokenBalance(balance);
      }
      const CoinGeckoClient = new CoinGecko();
      let data = await CoinGeckoClient.simple.price({ ids: ["fantom"] });
      setCoinPrice(data.data.fantom.usd);
    };
    fetchData();
    return () => {
      setCoinPrice(0);
    };
  }, []);
  return (
    <div className="flex flex-col gap-2 w-[300px] md:w-full">
      <div>{label}</div>
      <div
        className={`flex justify-center border-2 rounded-md ${
          error && "border-red-600"
        }  `}
      >
        <div
          onClick={() => (!selectDisabled ? setOpenSelect(!openSelect) : null)}
          className={`flex rounded text-xs md:text-base  py-2 px-1  w-[300px] md:w-[225px]  bg-gray-300 dark:bg-dark-3 dark:hover:bg-dark-4 justify-evenly ${
            selectDisabled ? "cursor-not-allowed" : "cursor-pointer"
          } items-center `}
        >
          <div className="flex items-center">
            <img
              width={32}
              src={selectedToken?.image}
              alt={`token-${selectedToken?._id}`}
            />
            <div className="px-2  ">{selectedToken?.name}</div>
          </div>
          {openSelect && (
            <div className="absolute rounded top-[170px]  w-[130px] bg-gray-300 dark:bg-dark-3">
              <div className="flex flex-col gap-2 px-2">
                {payTokens.map((token) => {
                  return (
                    <div
                      onClick={() =>
                        token.disabled ? null : handleSelectPayToken(token)
                      }
                      key={token.name}
                      className={`flex items-center p-1 ${
                        token?.disabled
                          ? "cursor-not-allowed dark:text-gray-500"
                          : "hover:dark:bg-dark-2 hover:bg-gray-600  "
                      } ${
                        token?.name === selectedToken.name &&
                        " bg-gray-400 dark:bg-dark-2"
                      } `}
                    >
                      <img
                        width={32}
                        src={token?.image}
                        className={`${token.disabled && "opacity-50"}`}
                        alt={`option-${token._id}`}
                      />
                      <div className="px-2 ">{token?.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!selectDisabled && (
            <Icon
              icon="ci:play-arrow"
              rotate={openSelect ? 1 : 0}
              width="20"
              height="20"
            />
          )}
        </div>

        <input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={`w-full p-2 text-end dark:bg-dark-4 outline-0 ${
            error && "text-red-600"
          }`}
          type="number"
        />
        <div
          className={`border-l w-fit px-4 dark:bg-dark-4 text-gray-400 flex items-center justify-center`}
        >
          <span>{formatPrice(value)}</span>
        </div>
      </div>
      {showBalance && (
        <div className="flex w-full justify-end text-gray-400">
          Balance {parseFloat(tokenBalance).toFixed(4)}
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{errorMessage}</div>}
    </div>
  );
};
