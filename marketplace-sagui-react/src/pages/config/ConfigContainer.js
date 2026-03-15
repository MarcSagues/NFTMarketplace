import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateProvider";
import { PageWithLoading } from "../../components/basic/PageWithLoading";
import useRespnsive from "../../hooks/useResponsive";
import { Icon } from "@iconify/react";

export default function ConfigContainer() {
  const [{ verifiedAddress, literals }] = useStateContext();
  const navigate = useNavigate();
  const { _width } = useRespnsive();

  return (
    <PageWithLoading loading={false}>
      <div className="flex flex-col md:flex-row  w-screen  h-full">
        {/** SIDEBAR */}
        <div className="px-8 pt-4 flex flex-col gap-4 w-full md:w-[400px] h-full border-b border-gray-300 md:border-0 ">
          <b className="uppercase text-gray-500 ">
            {literals.profileSettings.settings}
          </b>
          <div
            onClick={() => navigate("/account/settings/profile")}
            className={`p-2 cursor-pointer hover:bg-gray-300 flex items-center gap-5`}
          >
            <Icon icon="healthicons:ui-user-profile" width="32" />
            <div className="text-lg">{literals.profileSettings.account}</div>
          </div>
          {/* <div
            onClick={() => navigate("/account/settings/notifications")}
            className={`p-2 cursor-pointer hover:bg-gray-300 flex items-center gap-5`}
          >
            <Icon icon="ion:notifications-circle" width="32" />
            <div className="text-lg">
              {literals.profileSettings.notifications}
            </div>
          </div> */}
          <div
            onClick={() => navigate("/account/settings/appeareance")}
            className={`p-2 cursor-pointer hover:bg-gray-300 flex items-center gap-5`}
          >
            <Icon icon="iconoir:emoji-look-bottom" width="32" />
            <div className="text-lg">{literals.profileSettings.appearance}</div>
          </div>
        </div>

        <div className="h-screen border-l border-gray-400 w-full">
          <Outlet />
        </div>
      </div>
    </PageWithLoading>
  );
}
