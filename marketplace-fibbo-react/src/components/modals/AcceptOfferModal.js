import React from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateProvider";
import { formatLiteral } from "../../utils/language";
import { isMobile } from "react-device-detect";
import { ActionModal } from "./ActionModal";
export default function AcceptOfferModal({
  showModal,
  handleCloseModal,
  offer,
  onAcceptOffer,
}) {
  const navigate = useNavigate();
  const [{ literals }] = useStateContext();
  const handleAcceptOffer = async () => {
    try {
      await onAcceptOffer(offer.creator.wallet);
      return "OK";
    } catch (e) {
      return "ERROR";
    }
  };
  return (
    <ActionModal
      title={literals.acceptOfferModal.acceptOffer}
      size="large"
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      onSubmit={() => handleAcceptOffer()}
      submitLabel={literals.acceptOfferModal.acceptOffer}
      completedText={formatLiteral(literals.modals.offerAccepted, [
        offer?.price,
        offer?.payToken?.name,
      ])}
      completedLabel={literals.modals.seeUpdatedItem}
      completedAction={handleCloseModal}
    >
      <div className="my-10 mx-8 flex flex-col gap-10">
        <div className="flex flex-col gap-10 w-full text-center ">
          <div>{literals.acceptOfferModal.doYouAccept}</div>
          <div className="flex items-center justify-evenly">
            <div className="flex gap-2 items-center p-2 rounded-lg dark:bg-dark-4">
              <img
                className="rounded-full"
                width={32}
                src={offer?.creator?.profileImg}
                alt={`from-${offer._id}-img`}
              />
              <p
                className="text-primary-2 underline cursor-pointer"
                onClick={() =>
                  isMobile
                    ? navigate(`/account/${offer?.creator?.wallet}`)
                    : window.open(
                        `/account/${offer?.creator?.wallet}`,
                        "_blank"
                      )
                }
              >
                {offer?.creator?.username}
              </p>
            </div>
            <p> {literals.acceptOfferModal.isOffering} </p>
            <div className="flex gap-3 items-center  p-2 rounded-lg dark:bg-dark-4">
              <p>{offer.price}</p>
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
