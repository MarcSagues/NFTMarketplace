import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollections } from "../../contracts/collection";
import { ActionModal } from "./ActionModal";
import { useStateContext } from "../../context/StateProvider";

export default function DeleteItemModal({
  children,
  showModal,
  handleCloseModal,
  tokenId,
  collectionInfo,
  itemData,
  onDeleteItem,
  wallet,
}) {
  const navigate = useNavigate();
  const [secure, setSecure] = useState(false);
  const [{literals}] = useStateContext();

  const goToCollection = () => {
    if (collectionInfo.customURL) {
      navigate(`/collection/${collectionInfo.customURL}`);
    } else {
      navigate(`/collection/${collectionInfo.contractAddress}`);
    }
  };
  const handleDeleteItem = async () => {
    try {
      await onDeleteItem();
      return "OK";
    } catch (e) {
      console.log(e);
      return "ERROR";
    }
  };

  return (
    <ActionModal
      title={literals.deleteItemModal.deleteNFT}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      submitLabel={literals.deleteItemModal.delete}
      submitDisabled={!secure}
      onSubmit={handleDeleteItem}
      completedLabel={literals.deleteItemModal.viewCollection}
      completedText={literals.deleteItemModal.deletedOk}
      completedAction={goToCollection}
    >
      <div className="my-10 mx-3 md:mx-8 flex flex-col items-center gap-10">
        <div>
          {literals.deleteItemModal.ifYouAccept}
        </div>

        <div>{literals.deleteItemModal.confirmDelete}</div>
        <label className="">
          <input
            type="checkbox"
            onChange={() => setSecure(!secure)}
            checked={secure}
          />
          <span className="font-bold text-lg text-gray-700 dark:text-gray-400 border-gray-300 p-3">
          {literals.deleteItemModal.confirm}
          </span>
        </label>
      </div>
    </ActionModal>
  );
}
