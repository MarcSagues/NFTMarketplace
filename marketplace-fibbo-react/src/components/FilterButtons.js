import React, { useEffect, useState } from "react";

export default function FilterButtons({
  options,
  filtersSelected,
  onSelection,
}) {
  return (
    <div className="flex flex-wrap bg-gray-100 dark:bg-dark-3 justify-center gap-4 w-full h-30 p-3 border-t border-gray-300   ">
      {options.map((option) => {
        return (
          <FilterButton
            key={option.name}
            option={option}
            filtersSelected={filtersSelected}
            onSelection={onSelection}
          />
        );
      })}
    </div>
  );
}

const FilterButton = ({ option, filtersSelected, onSelection }) => {
  const [selected, setIsSelected] = useState(false);

  const handleSelect = () => {
    if (!option.disabled) {
      setIsSelected(!selected);
      option.filter(option);
    }
  };

  useEffect(() => {
    if (option.contractAddress) {
      let sel = filtersSelected.find((item) => item.name === option.name);
      setIsSelected(sel ? true : false);
    } else {
      setIsSelected(filtersSelected.includes(option.name));
    }
  }, [filtersSelected]);

  return (
    <button
      onClick={handleSelect}
      className={`flex items-center bg-white   ${
        selected && "dark:bg-gray-700 bg-gray-300"
      } ${
        option.disabled
          ? "cursor-not-allowed text-gray-500"
          : "hover:bg-gray-300 dark:hover:bg-dark-4 text-black dark:text-white "
      } dark:bg-dark-3  font-bold py-2 px-4 rounded justify-center border border-gray-300  gap-2`}
    >
      {option.image && (
        <img
          className={`${option.disabled && "opacity-50"}`}
          src={option.image}
          width={24}
        />
      )}
      {option.name}
    </button>
  );
};
