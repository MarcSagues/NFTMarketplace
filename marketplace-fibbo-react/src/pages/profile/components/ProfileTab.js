import React from "react";

export const ProfileTab = ({ title, count, type, selectedType, onClick }) => {
  return (
    <div
      className={`flex items-center gap-4 cursor-pointer hover:text-blue-400 transition ${
        type.type === selectedType.type && "text-blue-400"
      } `}
      onClick={onClick}
    >
      <div className="font-extrabold">{title}</div>
      <div className="rounded-full px-2 py-1 text-sm bg-gray-300 dark:bg-dark-4">
        {count}
      </div>
    </div>
  );
};
