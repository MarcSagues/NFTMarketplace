import { Icon } from "@iconify/react";
import React from "react";
import { Dialog } from "@headlessui/react";

export const BasicModal = ({
  children,
  title,
  showModal,
  handleCloseModal,
  size,
}) => {
  return (
    <Dialog
      as="div"
      open={showModal}
      className="fixed inset-0 z-10 overflow-y-auto "
      onClose={handleCloseModal}
    >
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>

        <div
          className={`dark:bg-dark-3 dark:text-white inline-block w-full ${
            size === "large" ? "max-w-2xl" : "max-w-xl"
          } p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl dark:shadow-dark-1 shadow-gray-400  rounded-2xl`}
        >
          <Dialog.Panel>
            <Dialog.Title
              as="h3"
              className="dark:text-white text-lg font-medium leading-6 text-gray-900 flex justify-between"
            >
              <div className="font-bold">{title}</div>
              <div
                className="cursor-pointer"
                onClick={() => handleCloseModal()}
              >
                <Icon className="text-2xl" icon="ant-design:close-outlined" />
              </div>
            </Dialog.Title>

            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};
