import React from "react";
import ActionButton from "../ActionButton";
import { useStateContext } from "../../context/StateProvider";

import { BasicModal } from "./BasicModal";

export default function AdditionalContentModal({
  children,
  showModal,
  handleCloseModal,
  additionalContent,
}) {
  const [{ literals }] = useStateContext();
  return (
    <BasicModal
      title={literals.confirmCreateModal.additionalContent}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      size="large"
    >
      <div className="my-10 mx-3 md:mx-8 flex flex-col items-center gap-10">
        <div className="p-3 border text-gray-500 rounded-lg border-gray h-fit w-full">
          {additionalContent}
        </div>
        <ActionButton
          text={literals.modals.close}
          buttonAction={handleCloseModal}
          size="large"
        />
      </div>
    </BasicModal>
  );
}
