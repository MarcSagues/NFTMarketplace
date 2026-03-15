import React, { useContext } from "react";
import ReactTooltip from "react-tooltip";
import { ThemeContext } from "../../context/ThemeContext";

export const ButtonTooltip = ({
  tooltip,
  tooltipText,
  tooltipPlacement,
  onClick,
  disabled,
  children,
  className,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`flex items-center${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }${
        disabled
          ? "dark:text-gray-600 text-gray-200"
          : "dark:hover:text-gray-400 hover:text-gray-400"
      }`}
      data-for={!disabled && tooltip}
      onClick={() => !disabled && onClick()}
      data-tip={!disabled ? tooltipText : null}
    >
      <div className={`${className} z-99`}>{children}</div>
      {tooltip && !disabled && (
        <ReactTooltip
          id={tooltip}
          place={tooltipPlacement ? tooltipPlacement : "top"}
          type={theme === "dark" ? "light" : "dark"}
          effect="solid"
          multiline={true}
        />
      )}
    </div>
  );
};
