import React, { useEffect, useState } from "react";
import { formatEther } from "ethers/lib/utils";
import { useWFTMContract } from "../../contracts/wftm";
import { Erc20AmountInput } from "../inputs/Erc20AmountInput";
import { DateTimeInput } from "../inputs/DateTimeInput";
import { ActionModal } from "./ActionModal";
import { useStateContext } from "../../context/StateProvider";
import { formatLiteral } from "../../utils/language";
export default function MakeOfferModal({
  showModal,
  handleCloseModal,
  wallet,
  onMakeOffer,
}) {
  const [offerPrice, setOfferPrice] = useState(0);
  const [wftmBalance, setWftmBalance] = useState(0);
  const [expireDate, setExpireDate] = useState(0);
  const [expireHour, setExpireHour] = useState(0);
  const [actionError, setActionError] = useState(false);
  const [payTokenSelected, setPayTokenSelected] = useState(null);
  const [{ updatedWFTM, literals }] = useStateContext();

  const { getWFTMBalance, getTotalFTMBalance } = useWFTMContract();
  const handleMakeOffer = async () => {
    try {
      var endTime = new Date(`${expireDate}T${expireHour}`);
      const deadline = Math.floor(endTime.getTime() / 1000);

      await onMakeOffer(offerPrice, deadline, payTokenSelected);
      return "OK";
    } catch (e) {
      return "ERROR";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const date = today.setDate(today.getDate() + 1);
      let valueDate = new Date(date);
      setExpireDate(valueDate.toISOString().split("T")[0]);
      setExpireHour("23:59");

      if (wallet) {
        const walletBalanceFTM = await getTotalFTMBalance(wallet);
        setWftmBalance(walletBalanceFTM);
      }
    };
    fetchData();
  }, [wallet]);

  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        const walletBalanceWFTM = await getWFTMBalance(wallet);
        setWftmBalance(formatEther(walletBalanceWFTM));
      }
    };
    fetchData();
  }, [updatedWFTM]);
  return (
    <ActionModal
      title={literals.actions.makeOffer}
      size="large"
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      onSubmit={() => handleMakeOffer()}
      submitLabel={literals.actions.makeOffer}
      completedLabel={literals.actions.viewYourOffer}
      completedText={formatLiteral(literals.modals.offerMade, [
        offerPrice,
        payTokenSelected?.name,
      ])}
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
              label={literals.makeOffer.offerPrice}
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
            label={literals.makeOffer.expires}
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
