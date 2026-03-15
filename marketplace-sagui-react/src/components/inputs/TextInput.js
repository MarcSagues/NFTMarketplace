import React from "react";

export const TextInput = ({
  label,
  required,
  error,
  value,
  onChange,
  disabled,
  errorMessage,
  placeholder,
  info,
}) => {
  return (
    <div className="flex flex-col gap-3  mb-4">
      <div className="font-bold text-lg flex ">
        {label} {required && <div className="text-red-700">*</div>}
      </div>
      {info && <div className="text-sm">{info}</div>}
      <input
        value={value}
        onChange={onChange}
        type="text"
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full dark:bg-dark-1 px-3 py-1.5 text-base font-normal text-gray-700 dark:text-gray-200 
        bg-white bg-clip-padding border border-solid border-black dark:border-primary-2 rounded transition ease-in-out m-0
        focus:text-gray-700 focus:bg-white focus:border-primary-1 focus:outline-none  1"
        ${error && "border-red-400 dark:border-red-400"}`}
      />
      {error && <div className="text-xs text-red-400 ">{errorMessage}</div>}
    </div>
  );
};
