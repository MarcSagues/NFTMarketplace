import React, { useEffect, useState } from "react";

import { formatEther } from "ethers/lib/utils";
import { useWFTMContract } from "../../contracts/wftm";
import { ActionModal } from "./ActionModal";
import { useStateContext } from "../../context/StateProvider";
import { formatLiteral } from "../../utils/language";

export default function BuyNowModal({
  collection,
  showModal,
  handleCloseModal,
  tokenId,
  wallet,
  tokenInfo,
  highestBid,
  auctionInfo,
  onBuyNow,
}) {
  const [wftmBalance, setWftmBalance] = useState(0);
  const { getTotalFTMBalance } = useWFTMContract();
  const [{ literals }] = useStateContext();
  const handleBuyNow = async () => {
    try {
      await onBuyNow();
      return "OK";
    } catch (e) {
      return "ERROR";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        const walletBalanceFTM = await getTotalFTMBalance(wallet);
        setWftmBalance(walletBalanceFTM);
      }
    };
    fetchData();
  }, [wallet]);
  return (
    <ActionModal
      title={literals.actions.buyNow}
      size="large"
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      onSubmit={() => handleBuyNow()}
      submitLabel={literals.actions.buyNow}
      completedText={formatLiteral(literals.modals.buyNowSuccess, [
        auctionInfo?.buyNoPrice,
        auctionInfo?.payToken.name,
      ])}
      completedLabel={literals.modals.seeOwnedItem}
      completedAction={handleCloseModal}
      submitDisabled={wftmBalance < auctionInfo?.buyNowPrice}
    >
      <div className="my-10 mx-8 flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-center gap-3 ">
              <p>{literals.buyNowModal.buyItem}</p>
              <img
                width={32}
                src={auctionInfo?.payToken.image}
                alt="Fantom coin"
              />
              <p>
                {auctionInfo?.buyNowPrice} {auctionInfo?.payToken.name}
              </p>
              <p>?</p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 items-center justify-center">
          {auctionInfo?.buyNowPrice > wftmBalance && (
            <p className="text-sm text-red-600">
              {formatLiteral(literals.modals.notEnoughWftm, [
                auctionInfo?.payToken.name,
              ])}
            </p>
          )}
        </div>
      </div>
    </ActionModal>
  );
}
