import { Icon } from "@iconify/react";
import React, { useContext } from "react";
import ReactTooltip from "react-tooltip";
import { ThemeContext } from "../../context/ThemeContext";

export const HelpTooltip = ({
  tooltip,
  tooltipText,
  tooltipPlacement,
  disabled,
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
      data-for={tooltip}
      data-tip={tooltipText}
    >
      <Icon className="text-gray-500" icon="ci:help-circle-outline" />
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
