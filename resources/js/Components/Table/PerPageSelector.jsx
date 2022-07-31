import React, { Fragment } from "react";
import { SelectorIcon, CheckIcon } from "@heroicons/react/outline";
import { Listbox, Transition } from "@headlessui/react";

function getNoun(number, one, two, five) {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
}

export default function PerPageSelector({
  pageSize = 10,
  setPageSize,
  pageSizes = [3, 10, 20, 50],
  total = 1000,
  showAllElements = true,
}) {
  const allElements = "All elements";
  if (showAllElements) pageSizes.push(total);

  const pSizes = pageSizes;

  const getLocalizedNumberOfElements = (number) => {
    return getNoun(number, "элемент", "элемента", "элементов");
  };

  return (
    <Listbox
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e));
      }}
    >
      {({ open }) => (
        <>
          <div
            className="relative flex items-center"
            style={{ width: "220px" }}
          >
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
              <span className="block truncate">
                {`Показать ${
                  pageSize === total
                    ? allElements
                    : `${pageSize} ${getLocalizedNumberOfElements(pageSize)}`
                }
                `}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-600"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm bottom-8">
                {pSizes.map((pSize, i) => (
                  <Listbox.Option
                    key={`pSize${i === pSizes.length - 1 ? `All` : pSize}`}
                    className={({ active }) => `
                     ${
                       active ? "bg-gray-200" : "text-gray-900"
                     } cursor-default select-none relative py-2 pl-8 pr-4`}
                    value={pSize}
                  >
                    {() => (
                      <>
                        <span
                          className={`${
                            pageSize === pSize ? "font-semibold" : "font-normal"
                          } block truncate text-xs'`}
                        >
                          {`Показать ${
                            i === pSizes.length - 1
                              ? `все элементы`
                              : `${pSize} ${getLocalizedNumberOfElements(
                                  pSize
                                )}`
                          }`}
                        </span>

                        {pageSize === pSize ? (
                          <span
                            className={`${
                              pageSize === pSize
                                ? "text-gray-600"
                                : "text-indigo-600"
                            } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
