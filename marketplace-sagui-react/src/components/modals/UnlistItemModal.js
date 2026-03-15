import React from "react";
import { ActionModal } from "./ActionModal";
import { useStateContext } from "../../context/StateProvider";

export default function UnlistItemModal({
  children,
  showModal,
  handleCloseModal,
  listing,
  tokenInfo,
  wallet,
  onUnlistItem,
}) {
  const unlistItem = async () => {
    try {
      await onUnlistItem();
      return "OK";
    } catch (e) {
      return "ERROR";
    }
  };
  const [{ literals }] = useStateContext();
  return (
    <ActionModal
      title={literals.unlistItemModal.quitItem}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      size="large"
      onSubmit={() => unlistItem()}
      submitLabel={literals.unlistItemModal.deleteItem}
      completedText={literals.unlistItemModal.deletedOk}
      completedLabel={literals.unlistItemModal.itemUpdated}
      completedAction={handleCloseModal}
    >
      <div className="my-10 mx-8 flex flex-col items-center gap-10">
        <div className="w-full flex-col items-center justify-center">
          <div className="flex flex-col md:flex-row items-center gap-3 justify-evenly">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <b>{literals.unlistItemModal.name}</b>
                <p>{tokenInfo?.name}</p>
              </div>
              <div className="flex gap-2">
                <b>{literals.unlistItemModal.royalties}</b>
                <p>{tokenInfo?.royalty}</p>
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
            </div>
            <div>
              <img
                src={tokenInfo?.image}
                width={"128px"}
                alt={`tokenImage-${tokenInfo?.name}`}
              />
            </div>
          </div>
        </div>
      </div>
    </ActionModal>
  );
}
