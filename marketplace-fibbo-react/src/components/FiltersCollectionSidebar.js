import { Icon } from "@iconify/react";
import React from "react";
import FilterBottomDropDown from "./FilterBottomDropDown";
import FilterButtons from "./FilterButtons";
import { useStateContext } from "../context/StateProvider";
import FiltersSelectList from "./FilterSelectList";

export default function FiltersCollectionSidebar({
  items,
  openedSidebar,
  setOpenedSidebar,
  setVisibleMarketItems,
  filtersSelected,
  statusFilters,
  contentFilters,
  payTokenFilters,
  categories,
  selectCategory,
}) {
  const handleShowSidebar = (show) => {
    setOpenedSidebar(show);
  };

  const [{ literals }] = useStateContext();

  return (
    <div className="hidden md:flex ">
      {openedSidebar ? (
        <div
          className={`flex dark:text-gray-400 flex-col  w-[17vw] bg-white-600 z-40 border-r border-gray-300 ${
            openedSidebar ? "-translate-x-0 " : "-translate-x-full"
          }`}
        >
          <div
            className="flex flex-row px-4 py-5  justify-between items-center cursor-pointer"
            onClick={() => handleShowSidebar(!openedSidebar)}
          >
            <div className="text-2xl font-semibold ">
              {literals.filters.filters}
            </div>
            <button>
              <Icon
                icon="eva:menu-arrow-outline"
                width="40"
                height="40"
                className="dark:text-gray-400 text-gray-400"
              />
            </button>
          </div>
          <div className="flex flex-col font-medium w-full">
            <FilterBottomDropDown name={literals.filters.state}>
              <FilterButtons
                options={statusFilters}
                filtersSelected={filtersSelected}
              />
            </FilterBottomDropDown>
            <FilterBottomDropDown name={literals.filters.contentType}>
              <FilterButtons
                options={contentFilters}
                filtersSelected={filtersSelected}
              />
            </FilterBottomDropDown>
            <FilterBottomDropDown name={literals.filters.categories}>
              <FiltersSelectList
                list={categories}
                onClick={selectCategory}
                filtersSelected={filtersSelected}
                notFoundText={literals.actions.noCategories}
              />
            </FilterBottomDropDown>
            {/* <FilterBottomDropDown name="Token">
              <FilterButtons
                options={payTokenFilters}
                filtersSelected={filtersSelected}
              />
            </FilterBottomDropDown> */}

            {/*  <FilterBottomDropDown name="Precio">
              <FilterRange
                min_state={min_state}
                max_state={max_state}
                setMaxState={setMaxState}
                setMinState={setMinState}
                applyFilter={applyRangeFilter}
              />
            </FilterBottomDropDown> */}
          </div>
        </div>
      ) : (
        <div className="flex dark:text-gray-400 flex-col px-4  bg-white-600  fixed h-full z-40 border-r border-gray-300">
          <button
            onClick={() => handleShowSidebar(!openedSidebar)}
            className="text-4xl dark:text-gray-400 text-black py-5 cursor-pointer z-50 hover:-translate-y-0.5"
          >
            <Icon
              icon="eva:menu-arrow-outline"
              hFlip={true}
              width="40"
              height="40"
              className="dark:text-gray-400 text-gray-400"
            />
          </button>
        </div>
      )}
    </div>
  );
}
