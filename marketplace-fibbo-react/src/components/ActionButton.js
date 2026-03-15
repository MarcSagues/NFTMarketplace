import React, { useEffect, useState } from "react";
import {useStateContext} from "../context/StateProvider"

const styles = {
  basicStyle:
    "flex items-center justify-center bg-gradient-to-r from-[#7E29F1] to-[#8BC3FD]  text-white  text-sm uppercase rounded shadow-md  leading-tight ",
  disabledStyle:
    "bg-gray-300 text-gray-600 cursor-not-allowed text-sm uppercase rounded shadow-md  leading-tight ",
  small: "w-[150px] h-[35px]  ",
  smaller: "w-[75px] h-[35px]",
  large: "w-[225px] h-[40px]   ",
  contained:
    "border text-white  text-sm uppercase rounded shadow-md  leading-tight hover:bg-white hover:text-primary-4 hover:border hover:border-primary-4 transition duration-150 ease-in-out",
  gradient: "",
  contentDisabled: "",
  smallerContent:
    "w-[73px] h-[33px] text-xs py-2 px-3 flex items-center justify-center ",
  smallContent:
    "w-[148px] h-[33px] py-2 px-2 flex items-center justify-center ",
  largeContent:
    "w-[223px]  h-[38px] py-2.5 px-4  flex items-center justify-center",
};

const getVariantStyle = (size, disabled) => {
  let finalStyle = styles[size];
  if (disabled) {
    finalStyle = `${finalStyle} ${styles.disabledStyle}`;
  } else {
    finalStyle = `${finalStyle} ${styles.basicStyle}`;
  }

  return finalStyle;
};

const getContentStyles = (size, disabled) => {
  let finalStyle = "";
  if (disabled) {
    finalStyle = `${finalStyle} ${styles.content}`;
  } else {
    finalStyle = `${finalStyle} ${styles[`${size}Content`]}`;
  }
  return finalStyle;
};
export default function ActionButton({
  text,
  children,
  buttonAction,
  variant,
  disabled,
  size,
}) {
  const [{literals}] = useStateContext();
  const [loading, setLoading] = useState(false);
  const [actionDone, setActionDone] = useState(false);

  const executeAction = async (e) => {
    try {
      setLoading(true);
      await buttonAction(e);
      setLoading(false);
      setActionDone(true);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, [actionDone]);
  return (
    <button
      onClick={(e) => executeAction(e)}
      disabled={loading || disabled}
      className={`${getVariantStyle(
        size,
        disabled
      )} dark:shadow-lg dark:shadow-gray-700 `}
    >
      {loading ? (
        <div className="flex gap-4 items-center justify-center text-xs">
          <div className="w-2 h-2 p-2 border-blue border-4 rounded-lg animate-spin"></div>
          <div>{literals.actions.processing}</div>{" "}
        </div>
      ) : (
        <div
          className={`${getContentStyles(size, disabled)} ${
            !disabled && "hover:bg-white hover:text-primary-1"
          }`}
        >
          <h1
            className={`${
              !disabled &&
              "hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r  hover:from-[#7E29F1] hover:to-[#8BC3FD]"
            }`}
          >
            {text}
          </h1>
        </div>
      )}
    </button>
  );
}
