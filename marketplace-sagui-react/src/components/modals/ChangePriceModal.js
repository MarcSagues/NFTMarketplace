import React, { useState } from "react";
import { useStateContext } from "../../context/StateProvider";
import { formatLiteral } from "../../utils/language";
import { Erc20AmountInput } from "../inputs/Erc20AmountInput";
import { ActionModal } from "./ActionModal";

export default function ChangePriceModal({
  children,
  showModal,
  handleCloseModal,
  onUpdatePrice,
  wallet,
}) {
  const [priceFor, setPriceFor] = useState(0);
  const [payTokenSelected, setPayTokenSelected] = useState(null);
  const [{ literals }] = useStateContext();

  const changeListingPrice = async () => {
    try {
      if (priceFor > 0) {
        //en el contrato del marketplace -> createMarketItem
        await onUpdatePrice(priceFor, payTokenSelected);
        return "OK";
      }
    } catch (e) {
      return "ERROR";
    }
  };
  return (
    <ActionModal
      title={literals.changePriceModal.changePrice}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      size="large"
      onSubmit={() => changeListingPrice()}
      submitLabel={literals.actions.changePrice}
      completedText={formatLiteral(literals.modals.changedPrice, [
        priceFor,
        payTokenSelected?.name,
      ])}
      completedLabel={literals.changePriceModal.updatedItem}
      completedAction={handleCloseModal}
    >
      <div className="my-10 mx-8 flex flex-col items-center gap-10 pb-10">
        <Erc20AmountInput
          label={literals.changePriceModal.price}
          value={priceFor}
          onChange={setPriceFor}
          selectedToken={payTokenSelected}
          setSelectedToken={setPayTokenSelected}
        />
      </div>
    </ActionModal>
  );
}
