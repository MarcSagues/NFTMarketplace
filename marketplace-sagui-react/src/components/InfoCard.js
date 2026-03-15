import { Icon } from "@iconify/react";
import React from "react";

export const InfoCard = ({ image, icon, title, content }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-10 p-5 w-[350px] border rounded-3xl shadow-lg">
      <div className="flex items-center justify-center">
        {icon ? (
          <Icon icon={icon} width={200} />
        ) : (
          <img width={225} src={image} alt={`${title}-card`} />
        )}
      </div>
      <div className="text-xl font-bold">{title}</div>
      <div className="text-md">{content}</div>
    </div>
  );
};
