import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useRef } from "react";

export const MultipleSelect = ({
  label,
  buttonLabel,
  info,
  options,
  selectOption,
  required,
  optionsSelected,
  removeOption,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const buttonRef = useRef(null);

  const showMenu = (e) => {
    setOpenMenu(!openMenu);
  };
  return (
    <div className="flex flex-col gap-3  mb-4">
      <div className="font-bold text-lg flex ">
        {label} {required && <div className="text-red-700">*</div>}
      </div>
      {info && <div className="text-sm">{info}</div>}
      <div className="flex gap-5">
        <button
          ref={buttonRef}
          onClick={showMenu}
          className=" hover:bg-gray-100 dark:hover:bg-gray-700 py-3  border border-gray-400 text-gray-600 dark:text-gray-400 rounded shadow px-4"
        >
          {buttonLabel}
        </button>
        <div className="flex flex-wrap gap-2">
          {optionsSelected.map((opt) => {
            return (
              <div
                key={Math.random(1, 999999)}
                onClick={() => removeOption(opt)}
                className="cursor-pointer text-xs md:text-sm  flex  items-center gap-2 dark:bg-dark-2 hover:bg-gray-200 hover:dark:bg-dark-4 border border-gray-200 rounded-xl py-3 px-2"
              >
                <div className="flex gap-2 items-center">{opt.name}</div>

                <Icon icon="ep:close" width={24} />
              </div>
            );
          })}
        </div>
      </div>

      {openMenu && (
        <SelectMenu
          setOpenMenu={setOpenMenu}
          buttonRef={buttonRef}
          options={options}
          selectOption={selectOption}
        />
      )}
    </div>
  );
};

const SelectMenu = ({ setOpenMenu, buttonRef, options, selectOption }) => {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return (
    <>
      <div
        ref={ref}
        className="w-[225px] md:w-[300px] bg-gray-100 dark:bg-dark-2 absolute mt-[90px] z-20 flex flex-col  rounded-md"
      >
        {options.map((opt) => {
          return (
            <SelectMenuItem
              text={opt.name}
              icon={opt.icon}
              onClick={() => selectOption(opt)}
            />
          );
        })}
      </div>
    </>
  );
};

const SelectMenuItem = ({ text, icon, disabled, onClick }) => {
  return (
    <div
      onClick={disabled ? null : onClick}
      className={`p-2 ${
        disabled
          ? "cursor-not-allowed text-gray-400"
          : "cursor-pointer hover:bg-gray-300"
      }  flex items-center gap-5`}
    >
      <Icon icon={icon} width={32} />
      {text}
    </div>
  );
};
