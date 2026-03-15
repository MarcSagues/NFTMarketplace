import React from "react";

export const TextArea = ({
  label,
  required,
  error,
  info,
  value,
  rows,
  onChange,
  placeholder,
  errorMessage,
}) => {
  return (
    <div className="flex flex-col gap-1  mb-4">
      <div className="font-bold text-lg flex ">
        {label} {required && <div className="text-red-700">*</div>}
      </div>
      <div className="text-sm">{info}</div>
      <textarea
        className={` block dark:bg-dark-1 w-full px-3 py-1.5 text-md font-normal text-gray-700 bg-white bg-clip-padding 
            border border-solid border-black rounded transition ease-in-out m-0
            focus:text-gray-700 focus:bg-white  dark:border-primary-2  dark:text-gray-200 focus:border-blue-600 focus:outline-none ${
              error && "border-red-400 dark:border-red-400"
            }`}
        rows={rows ? rows : "3"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type="text"
      />
      {error && <div className="text-xs text-red-400 ">{errorMessage}</div>}
    </div>
  );
};
