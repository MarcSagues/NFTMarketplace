import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateProvider";
import useRespnsive from "../../hooks/useResponsive";
import { TextInput } from "../../components/inputs/TextInput";
import { TextArea } from "../../components/inputs/TextArea";
import { ImageInput } from "../../components/inputs/ImageInput";
import ActionButton from "../../components/ActionButton";

import useAccount from "../../hooks/useAccount";

export default function ConfigNotificationsContainer({ children }) {
  const [{ userProfile, literals }] = useStateContext();
  const { wallet, connectToWallet } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    connectToWallet();
  }, [wallet]);
  return (
    <div className="p-10 flex flex-col gap-10">
      <div>
        <p className="text-3xl font-black">{literals.profileSettings.notifications}</p>
      </div>

      <div className="flex flex-row w-full gap-10 ">
        <div className="flex gap-5 m-5">
          <input className="w-5 cursor-pointer" type="checkbox"/>
          <a className="text-xl">{literals.profileSettings.yourActivityNotifications}</a>
        </div>
        <div className="flex gap-5 m-5">
          <input className="w-5 cursor-pointer" type="checkbox"/>
          <a className="text-xl">{literals.profileSettings.followerActivityNotifications}</a>
        </div>
      </div>

    </div>
  );
}
