import { Icon } from "@iconify/react";
import React from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateProvider";
import { BasicModal } from "./BasicModal";

export default function OwnersModal({
  children,
  owners,
  showModal,
  handleCloseModal,
}) {
  const navigate = useNavigate();
  const [{ literals }] = useStateContext();

  const redirectToProfile = (profile) => {
    if (isMobile) {
      navigate(`/account/${profile.wallet}`);
    } else {
      window.open(`/account/${profile.wallet}`);
    }
  };
  return (
    <BasicModal
      title={literals.collectionDetail.owners}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
    >
      <div className="my-10 mx-3 md:mx-8 flex flex-wrap justify-center gap-10">
        {owners.map((owner) => {
          return (
            <div
              onClick={() => redirectToProfile(owner)}
              className="cursor-pointer flex  flex-col items-center  gap-2 hover:-translate-y-1"
              key={owner._id}
            >
              <div className="text-xl">{owner.username}</div>
              <img
                className="rounded-full object-contain w-[64px] h-[64px]"
                src={owner.profileImg}
                alt={`${owner._id}-profile`}
              />
            </div>
          );
        })}
      </div>
    </BasicModal>
  );
}
