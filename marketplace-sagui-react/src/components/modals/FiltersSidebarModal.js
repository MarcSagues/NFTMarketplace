import { Dialog } from "@headlessui/react";
import React from "react";
import { useStateContext } from "../../context/StateProvider";
import FilterBottomDropDown from "../FilterBottomDropDown";
import FilterButtons from "../FilterButtons";
import FiltersSelectList from "../FilterSelectList";

export const FiltersSidebarModal = ({
  openSidebar,
  setOpenSidebar,
  statusFilters,
  contentFilters,
  filtersSelected,
  payTokenFilters,
  collections,
  categories,
  selectCollection,
  selectCategory,
}) => {
  const [{ literals }] = useStateContext();
  return (
    <Dialog
      open={openSidebar}
      onClose={() => setOpenSidebar(false)}
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-white bg-opacity-50"
        id="headlessui-dialog-overlay-97"
      >
        <Dialog.Panel>
          <div className="mt-[79px] dark:bg-dark-3 dark:text-white ml-auto relative max-w-lg w-full h-screen shadow-xl py-4 pb-12 flex flex-col gap-3 overflow-y-auto bg-white text-black">
            <div className="px-4 flex items-center justify-between">
              <h2 className="text-sm uppercase font-600 tracking-wide">
                <div className="text-2xl font-semibold ">
                  {literals.filters.filters}
                </div>
              </h2>
              <button
                type="button"
                className="-mr-2 w-10 rounded-md flex items-center justify-center opacity-50"
                tabIndex="0"
                onClick={(e) => setOpenSidebar(false)}
              >
                <span className="sr-only">{literals.actions.close}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className=" pb-28 px-4 lg:px-0 pt-2 scrollbar-hide lg:max-h-[calc(100vh-11.5rem)] ">
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

              {collections && (
                <FilterBottomDropDown name={literals.filters.colections}>
                  <FiltersSelectList
                    list={collections}
                    onClick={selectCollection}
                    filtersSelected={filtersSelected}
                    notFoundText={literals.actions.noCollections}
                  />
                </FilterBottomDropDown>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
