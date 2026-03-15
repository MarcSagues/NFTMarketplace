import { Icon } from "@iconify/react";
import React, { useState } from "react";
import ReactModal from "react-modal";
import tw from "tailwind-styled-components";
import { useApi } from "../../../api";
import ActionButton from "../../../components/ActionButton";
import { BasicModal } from "../../../components/modals/BasicModal";
import { useStateContext } from "../../../context/StateProvider";
import useAccount from "../../../hooks/useAccount";

export default function NewFeatureModal({
  children,
  showModal,
  handleCloseModal,
}) {
  const { createNewSuggestion } = useApi();
  const [{ literals }] = useStateContext();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [completedAction, setCompletedAction] = useState(false);
  const { wallet } = useAccount();
  const addNewSuggestion = async () => {
    //Añadir la sugerencia en el Backend
    await createNewSuggestion(wallet, title, desc);

    setCompletedAction(true);
  };
  return (
    <BasicModal
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      size="large"
      title={literals.features.newSuggestion}
    >
      {!completedAction ? (
        <div className="my-10 mx-8 flex flex-col gap-10">
          <div className="hidden md:flex">
            {literals.features.newSuggestionText}
          </div>
          <div className="flex flex-col gap-2">
            <div className="uppercase">
              {literals.features.newSuggestionTitle}
            </div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="uppercase">
              {literals.features.newSuggestionDescription}
            </div>
            <InputTextArea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows="5"
            />
          </div>
          <div className="w-full flex justify-center">
            <ActionButton
              buttonAction={() => addNewSuggestion()}
              text={literals.actions.addSuggestion}
              size="large"
            />
          </div>
        </div>
      ) : (
        <div className="my-10 mx-8 flex flex-col items-center gap-10">
          <div>{literals.features.suggestionDoneText}</div>
          <ActionButton
            buttonAction={() => handleCloseModal()}
            text="Cerrar Ventana"
            size="large"
          />
        </div>
      )}
    </BasicModal>
  );
}

const Input = tw.input`
    text-black flex-1 outline-none p-2 bg-gray-300 font-bold rounded-md w-full
`;

const InputTextArea = tw.textarea`
    h-[200px] text-black flex-1 outline-none p-2 bg-gray-300 font-bold rounded-md w-full resize-y
`;
