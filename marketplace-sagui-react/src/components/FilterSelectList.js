import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../context/StateProvider";

export default function FiltersSelectList({
  list,
  onClick,
  filtersSelected,
  notFoundText,
}) {
  const [{ literals }] = useStateContext();
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState(list);
  const searchItems = (query) => {
    setSearchText(query);
  };

  useEffect(() => {
    if (searchText.length > 0) {
      let filter = filtered.filter((item) => {
        if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
      });
      setFiltered(filter);
    } else {
      setFiltered(list);
    }
  }, [searchText]);
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-dark-3  justify-center gap-4 w-full h-30 p-3 border-t border-gray-300   ">
      <div className="flex border-2 rounded">
        <div className="flex items-center justify-center px-4 border-l">
          <Icon icon="ant-design:search-outlined" />
        </div>
        <input
          type="text"
          onChange={(e) => searchItems(e.target.value)}
          className={`px-4 py-2 w-[100px] xl:w-[200px] outline-none dark:bg-dark-1 bg-gray-100`}
          value={searchText}
        />
      </div>
      <div className="flex flex-col overflow-y-scroll gap-3 max-h-[200px]">
        {filtered.length > 0 ? (
          <>
            {filtered.map((item) => {
              return (
                <ListItem
                  filtersSelected={filtersSelected}
                  onClick={onClick}
                  key={item._id}
                  item={item}
                />
              );
            })}
          </>
        ) : (
          <>{notFoundText}</>
        )}
      </div>
    </div>
  );
}

const ListItem = ({ item, onClick, filtersSelected }) => {
  const [selected, setIsSelected] = useState(false);
  const [{ lang }] = useStateContext();
  const handleSelect = () => {
    setIsSelected(!selected);
    onClick(item);
  };

  useEffect(() => {
    if (item.contractAddress) {
      let sel = filtersSelected.find((filter) => filter.name === item.name);
      setIsSelected(sel ? true : false);
    }
  }, [filtersSelected]);
  return (
    <div
      onClick={handleSelect}
      className={`px-2 py-1 flex gap-3 items-center ${
        selected && "dark:bg-dark-4 bg-gray-300"
      } dark:hover:bg-dark-4 hover:bg-gray-300 cursor-pointer`}
    >
      {item.icon ? (
        <Icon icon={item.icon} width={32} />
      ) : (
        <img
          src={item.logoImage}
          alt="recipient-img"
          className="rounded-full"
          width={32}
        />
      )}
      <div className="text-primary-2 cursor-pointer"></div>
      <div>
        {item.name?.eng
          ? lang === "eng"
            ? item.name.eng
            : item.name.esp
          : item.name}
      </div>
    </div>
  );
};
