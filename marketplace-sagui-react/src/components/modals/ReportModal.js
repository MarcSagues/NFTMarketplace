import React, { useState } from "react";
import { useStateContext } from "../../context/StateProvider";
import { ActionModal } from "./ActionModal";
import { TextArea } from "../inputs/TextArea";
import { useApi } from "../../api";
export default function ReportModal({
  type,
  wallet,
  reportedItem,
  showModal,
  handleCloseModal,
}) {
  const [{ literals }] = useStateContext();
  const { createNewReport } = useApi();
  const [desc, setDesc] = useState("");

  const sendReport = async () => {
    await createNewReport(type, wallet, desc, reportedItem);
    return "OK";
  };
  return (
    <ActionModal
      title={literals.actions.makeReport}
      size="large"
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      submitLabel={literals.modals.sendReport}
      submitDisabled={desc.length < 50}
      completedAction={handleCloseModal}
      completedLabel={literals.modals.close}
      onSubmit={sendReport}
      completedText={literals.modals.completedReport}
    >
      <div className="my-10 mx-8 flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center"></div>
          <TextArea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            label={literals.modals.reportDesc}
            rows={10}
            info={literals.modals.reportInfo}
          />
        </div>
      </div>
    </ActionModal>
  );
}
