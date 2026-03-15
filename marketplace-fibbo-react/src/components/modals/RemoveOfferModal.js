import React from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateProvider";
import { isMobile } from "react-device-detect";
import { ActionModal } from "./ActionModal";
export default function RemoveOfferModal({
  showModal,
  handleCloseModal,
  offer,
  onCancelOffer,
}) {
  const navigate = useNavigate();
  const [{ literals }] = useStateContext();
  const handleRemoveOffer = async () => {
    try {
      await onCancelOffer();
      return "OK";
    } catch (e) {
      return "ERROR";
    }
  };
  return (
    <ActionModal
      title={literals.removeOfferModal.cancelYourOffer}
      size="large"
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      onSubmit={() => handleRemoveOffer()}
      submitLabel={literals.removeOfferModal.cancelOffer}
      completedText={literals.removeOfferModal.canceledOk}
      completedLabel={literals.removeOfferModal.updated}
      completedAction={handleCloseModal}
    >
      <div className="my-10 mx-8 flex flex-col gap-10">
        <div className="flex flex-col gap-10 w-full text-center ">
          <div>{literals.removeOfferModal.cancel}</div>
          <div className="flex items-center justify-evenly">
            <div className="flex gap-2 items-center p-2 rounded-lg dark:bg-dark-4">
              <img
                className="rounded-full"
                width={32}
                src={offer?.creator?.profileImg}
                alt={`from-${offer?._id}-img`}
              />
              <p
                className="text-primary-2 underline cursor-pointer"
                onClick={() =>
                  isMobile
                    ? navigate(`/account/${offer?.creator?.wallet}`)
                    : window.open(
                        `/profile/${offer?.creator?.wallet}`,
                        "_blank"
                      )
                }
              >
                {literals.removeOfferModal.you}
              </p>
            </div>
            <p> {literals.removeOfferModal.offer} </p>
            <div className="flex gap-3 items-center  p-2 rounded-lg dark:bg-dark-4">
              <p>{offer?.price}</p>
              <img
                src={offer?.payToken?.image}
                width={32}
                alt={`token-${offer?.payToken?._id}`}
              />
            </div>
          </div>
        </div>
      </div>
    </ActionModal>
  );
}
