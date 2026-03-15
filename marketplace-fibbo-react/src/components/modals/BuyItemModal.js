import React, { useEffect, useState } from "react";
import { formatEther } from "ethers/lib/utils";
import { useWFTMContract } from "../../contracts/wftm";
import { ActionModal } from "./ActionModal";
import { useStateContext } from "../../context/StateProvider";
import { HelpTooltip } from "../tooltips/HelpTooltip";
import useProvider from "../../hooks/useProvider";

export default function BuyItemModal({
  children,
  showModal,
  handleCloseModal,
  onBuyItem,
  tokenInfo,
  listing,
  wallet,
}) {
  const [wftmBalance, setWftmBalance] = useState(0);
  const [balanceFTM, setBalanceFTM] = useState(0);

  const [{ updatedWFTM }] = useStateContext();
  const { getTotalFTMBalance } = useWFTMContract();
  const { getWalletBalance } = useProvider();
  const [{ literals }] = useStateContext();
  const handleBuyItem = async () => {
    try {
      await onBuyItem();
      return "OK";
    } catch (e) {
      return "ERROR";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        const balanceFTM = await getTotalFTMBalance(wallet);

        setBalanceFTM(balanceFTM);
      }
    };
    fetchData();
  }, [wallet]);
  return (
    <ActionModal
      title={literals.actions.buyItem}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      size="large"
      onSubmit={() => handleBuyItem()}
      submitLabel={literals.actions.buyItem}
      completedText={literals.modals.buySuccess}
      completedLabel={literals.modals.seeOwnedItem}
      completedAction={handleCloseModal}
      submitDisabled={balanceFTM < listing?.price}
    >
      {wallet !== "" && (
        <div className="my-5 mx-8 flex flex-col gap-10">
          <div className="w-full flex-col items-center justify-center">
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
                <div>
                  <img
                    src={tokenInfo?.image}
                    className="w-[112px] md:w-[168px]"
                    alt={`tokenImage-${tokenInfo?.name}`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <b>{literals.buyItemModal.name}</b>
                    <p>{tokenInfo?.name}</p>
                  </div>

                  <div className="flex gap-2">
                    <b>{literals.detailNFT.price2}</b>
                    <img
                      src={listing?.payToken.image}
                      width={26}
                      alt={`token-${listing?.payToken._id}`}
                    />
                    <p>{listing?.price}</p>
                    <p>{listing?.payToken.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <b>{literals.buyItemModal.royalties}</b>
                    <p>{tokenInfo?.royalty}</p>
                    <HelpTooltip
                      tooltip="royalty-info"
                      tooltipPlacement="bottom"
                      tooltipText={`Un ${tokenInfo?.royalty}% del precio de compra <br/> será enviado al creador del item <br/>`}
                    />
                  </div>
                  {balanceFTM < listing?.price && (
                    <div className="text-xs text-red-700">
                      {literals.buyItemModal.notWFTM}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-center mt-5">
                {literals.buyItemModal.fibboEarns}
              </div>
            </div>
          </div>
        </div>
      )}
    </ActionModal>
  );
}
