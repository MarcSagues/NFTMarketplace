import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import ActionButton from "../ActionButton";
import { BasicModal } from "./BasicModal";
import { Check } from "../lottie/Check";
import { useWFTMContract } from "../../contracts/wftm";
import { ethers } from "ethers";
import useProvider from "../../hooks/useProvider";
import { formatEther } from "ethers/lib/utils";
import CoinGecko from "coingecko-api";
import { useStateContext } from "../../context/StateProvider";
import { actionTypes } from "../../context/stateReducer";
import { formatLiteral } from "../../utils/language";

export default function WrappedFTMModal({
  children,
  showModal,
  handleCloseModal,
  wallet,
}) {
  const { getWFTMBalance, wrapFTM, unwrapFTMGassless } = useWFTMContract();
  const [{ userProfile, literals }, dispatch] = useStateContext();
  const [ftmAmount, setFtmAmount] = useState(0);
  const [completedAction, setCompletedAction] = useState(false);
  const [fromFTM, setFromFTM] = useState(true);
  const [ftmBalance, setFtmBalance] = useState(0);
  const [WftmBalance, setWFtmBalance] = useState(0);
  const [coinPrice, setCoinPrice] = useState(0);

  const { getWalletBalance } = useProvider();

  const handleInputChange = (value) => {
    if (value.includes(".") || value.includes(",")) {
      let numberOfDecimals = 0;
      if (value.includes(".")) {
        numberOfDecimals = value.split(".")[1].length;
      } else if (value.includes(",")) {
        numberOfDecimals = value.split(",")[1].length;
      }
      if (numberOfDecimals > 2) {
        setFtmAmount(parseFloat(value).toFixed(2));
      } else {
        setFtmAmount(value);
      }
    } else {
      setFtmAmount(value);
    }
  };

  const handleChangeFromFTM = (value) => {
    setFtmAmount(0);
    setFromFTM(!fromFTM);
  };

  const formatPrice = () => {
    let price = ftmAmount * coinPrice;
    if (!ftmAmount) {
      return "$0.00";
    }
    return "$" + price.toFixed(3).toString();
  };

  const closeModal = () => {
    setCompletedAction(false);
    setFtmAmount(0);
    handleCloseModal();
  };

  const handleWrapFTM = async () => {
    try {
      const isImported = userProfile.importedWFTM;
      const price = ethers.utils.parseEther(ftmAmount.toString());
      if (fromFTM) {
        await wrapFTM(isImported, wallet, price, wallet);
        dispatch({
          type: actionTypes.UPDATED_WFTM,
        });
        setCompletedAction(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnwrapFTM = async () => {
    try {
      const price = ethers.utils.parseEther(ftmAmount.toString());
      if (!fromFTM) {
        await unwrapFTMGassless(price);
        dispatch({
          type: actionTypes.UPDATED_WFTM,
        });
        setCompletedAction(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        const walletBalanceFTM = await getWalletBalance(wallet);
        setFtmBalance(walletBalanceFTM);

        const walletBalanceWFTM = await getWFTMBalance(wallet);
        setWFtmBalance(formatEther(walletBalanceWFTM));

        const CoinGeckoClient = new CoinGecko();
        let data = await CoinGeckoClient.simple.price({ ids: ["fantom"] });
        setCoinPrice(data.data.fantom.usd);
      }
    };
    fetchData();
  }, [showModal]);

  return (
    <BasicModal
      title={literals.wrappedFTMModal.station}
      size="large"
      showModal={showModal}
      handleCloseModal={handleCloseModal}
    >
      {!completedAction ? (
        <>
          {fromFTM ? (
            <div className="my-10 mx-8 flex flex-col gap-10">
              <div>
                <div className="flex gap-10">FTM</div>
                <div className="flex">
                  <input
                    value={ftmAmount}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={` border ${
                      ftmAmount > ftmBalance && "border-red-600"
                    } w-full p-2 text-end bg-transparent  outline-0`}
                    type="number"
                  />
                  <div
                    className={`border ${
                      ftmAmount > ftmBalance && "border-red-600"
                    }
                     w-24 dark:bg-dark-4 text-gray-400 flex items-center justify-center`}
                  >
                    <span>{formatPrice()}</span>
                  </div>
                </div>
                <div className="text-gray-400 flex w-full justify-end">
                  {literals.wrappedFTMModal.balance}{" "}
                  {parseFloat(ftmBalance).toFixed(4)}
                </div>
                {ftmAmount > ftmBalance && (
                  <div className="text-red-600 text-sm">
                    {literals.wrappedFTMModal.notFTM}
                  </div>
                )}
              </div>
              <div className="h-8 flex justify-center">
                <div
                  onClick={() => handleChangeFromFTM()}
                  className="border h-fit text-gray-400 border-gray-400 p-2 rounded-full"
                >
                  <Icon icon="charm:swap-vertical" width={"24px"} />
                </div>
              </div>
              <div>
                <div>FBBOFTM</div>
                <div className="flex">
                  <input
                    value={ftmAmount}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`border 
                     w-full p-2 text-end dark:bg-dark-4`}
                    type="number"
                  />
                  <div
                    className={`border w-24
                     dark:bg-dark-4 text-gray-400  flex items-center justify-center`}
                  >
                    <span>$0.00</span>
                  </div>
                </div>
                <div className="text-gray-400 flex w-full justify-end">
                  {literals.wrappedFTMModal.balance}{" "}
                  {parseFloat(WftmBalance).toFixed(4)}
                </div>
              </div>
            </div>
          ) : (
            <div className="my-10 mx-8 flex flex-col gap-10">
              <div>
                <div>FTM</div>
                <div className="flex">
                  <input
                    value={ftmAmount}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`border ${
                      ftmAmount > WftmBalance && "border-red-600"
                    } w-full p-2 text-end dark:bg-dark-4 outline-0`}
                    type="number"
                  />
                  <div
                    className={`border  ${
                      ftmAmount > WftmBalance && "border-red-600"
                    } w-24 dark:bg-dark-4 text-gray-400  flex items-center justify-center`}
                  >
                    <span>$0.00</span>
                  </div>
                </div>
                <div className="text-gray-400 flex w-full justify-end">
                  {literals.wrappedFTMModal.balance}{" "}
                  {parseFloat(WftmBalance).toFixed(4)}
                </div>
                {ftmAmount > WftmBalance && (
                  <div className="text-red-600 text-sm">
                    {literals.wrappedFTMModal.notWFTM}
                  </div>
                )}
              </div>
              <div className="h-8 flex justify-center">
                <div
                  onClick={() => handleChangeFromFTM()}
                  className="border h-fit text-gray-400 border-gray-400 p-2 rounded-full"
                >
                  <Icon icon="charm:swap-vertical" width={"24px"} />
                </div>
              </div>
              <div>
                <div>FTM</div>
                <div className="flex">
                  <input
                    value={ftmAmount}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="border w-full p-2 justify-end dark:bg-dark-4 outline-0"
                    type="number"
                  />
                  <div className="border w-24 dark:bg-dark-4 text-gray-400 flex items-center justify-center">
                    <span>$0.00</span>
                  </div>
                </div>
                <div className="text-gray-400 flex w-full justify-end">
                  {literals.wrappedFTMModal.balance}{" "}
                  {parseFloat(ftmBalance).toFixed(4)}
                </div>
              </div>
            </div>
          )}
          <div className="w-full flex items-center justify-center ">
            <ActionButton
              disabled={
                fromFTM ? ftmAmount > ftmBalance : ftmAmount > WftmBalance
              }
              buttonAction={fromFTM ? handleWrapFTM : handleUnwrapFTM}
              text={
                fromFTM
                  ? literals.wrappedFTMModal.changeWFTM
                  : literals.wrappedFTMModal.sendFTM
              }
              size="large"
            />
          </div>
        </>
      ) : (
        <div className="my-10 mx-8 flex flex-col gap-10">
          <div className="flex flex-col gap-5 items-center">
            <div className="flex gap-5 items-center">
              <Check />
              <p>
                {fromFTM
                  ? `${formatLiteral(literals.wrappedFTMModal.succesWrap, [
                      ftmAmount,
                    ])}`
                  : `${formatLiteral(literals.wrappedFTMModal.succesUnWrap, [
                      ftmAmount,
                    ])}`}
              </p>
            </div>

            <ActionButton
              size="large"
              variant={"contained"}
              text={literals.wrappedFTMModal.close}
              buttonAction={closeModal}
            />
          </div>
        </div>
      )}
    </BasicModal>
  );
}
