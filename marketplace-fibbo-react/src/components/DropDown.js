import { Icon } from "@iconify/react";
import React from "react";

export default function DropDown({ title, opened, children, icon, className }) {
  return (
    <details open={opened} className={` p-3 border-2 flex  ${className}`}>
      <summary className="flex cursor-pointer pb-2 border-b-2 border-t-none ">
        {icon ? (
          <div className="flex gap-3 items-center">
            <Icon icon={icon} width={32} />{" "}
            <div className="font-bold text-lg">{title}</div>
          </div>
        ) : (
          title
        )}
      </summary>
      <div className="mt-5 text-sm">{children}</div>
    </details>
  );
}
