import React from "react";

export default function SearchResultitem({ image, text, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center px-2 py-1 gap-3 dark:bg-dark-2 hover:bg-gray-300 border-b "
    >
      <div className="flex items-center justify-center">
        <img src={image} className="object-contain w-[64px] h-[64px]" alt="" />
      </div>
      <div>{text}</div>
    </div>
  );
}
