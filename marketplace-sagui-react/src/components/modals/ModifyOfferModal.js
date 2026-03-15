import React, { useEffect, useState } from "react";
import { formatEther } from "ethers/lib/utils";
import { useWFTMContract } from "../../contracts/wftm";
import { Erc20AmountInput } from "../inputs/Erc20AmountInput";
import { DateTimeInput } from "../inputs/DateTimeInput";
import { ActionModal } from "./ActionModal";
import { useStateContext } from "../../context/StateProvider";
export default function ModifyOfferModal({
  showModal,
  handleCloseModal,
  wallet,
  offer,
  onModifyOffer,
}) {
  const [offerPrice, setOfferPrice] = useState(0);
  const [wftmBalance, setWftmBalance] = useState(0);
  const [expireDate, setExpireDate] = useState(0);
  const [expireHour, setExpireHour] = useState(0);
  const [actionError, setActionError] = useState(false);
  const [payTokenSelected, setPayTokenSelected] = useState(null);
  const [{ updatedWFTM, literals }] = useStateContext();

  const { getTotalFTMBalance } = useWFTMContract();
  const handleMakeOffer = async () => {
    try {
      var endTime = new Date(`${expireDate}T${expireHour}`);
      const deadline = Math.floor(endTime.getTime() / 1000);

      await onModifyOffer(offerPrice, deadline, payTokenSelected);

      return "OK";
    } catch (e) {
      console.log(e);
      return "ERROR";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const date = new Date(offer.deadline * 1000);
      let day = date.toLocaleDateString("sv-SE");
      let hours = date.toTimeString().split(" ")[0];

      setExpireDate(day);
      setExpireHour(hours);

      setOfferPrice(offer.price);

      if (wallet) {
        const walletBalanceWFTM = await getTotalFTMBalance(wallet);
        setWftmBalance(walletBalanceWFTM);
      }
    };
    fetchData();
  }, [wallet, offer]);

  return (
    <ActionModal
      title={literals.modifyOfferModal.modifyOffer}
      size="large"
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      onSubmit={() => handleMakeOffer()}
      submitLabel={literals.modifyOfferModal.update}
      completedText={literals.modifyOfferModal.offerUpdated}
      completedLabel={literals.modifyOfferModal.viewOffer}
      completedAction={handleCloseModal}
      submitDisabled={
        parseFloat(wftmBalance) < parseFloat(offerPrice) ||
        actionError ||
        offerPrice === 0
      }
    >
      <div className="my-10 mx-8 flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center">
            <Erc20AmountInput
              label={literals.modifyOfferModal.price}
              value={offerPrice}
              onChange={setOfferPrice}
              error={parseFloat(wftmBalance) < parseFloat(offerPrice)}
              errorMessage={literals.makeOffer.notWFTM}
              selectedToken={payTokenSelected}
              setSelectedToken={setPayTokenSelected}
              showBalance={true}
            />
          </div>
          <DateTimeInput
            label={literals.modifyOfferModal.expires}
            valueDate={expireDate}
            valueHour={expireHour}
            onChangeDate={setExpireDate}
            onChangeHour={setExpireHour}
            errorType={{
              type: "AFTER",
              params: {
                to: new Date(),
              },
            }}
            setActionError={setActionError}
          />
        </div>
      </div>
    </ActionModal>
  );
}
