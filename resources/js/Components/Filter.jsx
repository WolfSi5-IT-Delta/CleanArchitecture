import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { useTranslation } from "react-i18next";

export default function Filter({ onClick }) {

  const { t } = useTranslation(['common', 'lc']);

  const handleClick = (e) => onClick(e.target.value);

  return (
    <Tab.Group as="div" className="mr-6 sm:ml-4 xs:mr-0 xs:mt-2" defaultIndex={2}>
      <Tab.List className="flex">
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={
                selected
                  ? "bg-white text-black border border-gray-400 font-medium text-sm rounded-l-md order-1 p-2 hover:bg-indigo-400 bg-indigo-400 xs:p-0 xs:px-4 xs:py-2"
                  : "bg-white text-black border border-gray-400 font-medium text-sm rounded-l-md order-1 p-2 hover:bg-indigo-400 xs:p-0 xs:px-4 xs:py-2"
              }
              onClick={handleClick}
              value="active"
            >
              {t('common:started')}
            </button>
          )}
        </Tab>

        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={
                selected
                  ? "bg-white text-black border border-gray-400 font-medium text-sm order-1 p-2 hover:bg-indigo-400 bg-indigo-400 xs:p-0 xs:px-4 xs:py-2"
                  : "bg-white text-black border border-gray-400 font-medium text-sm order-1 p-2 hover:bg-indigo-400 xs:p-0 xs:px-4 xs:py-2"
              }
              onClick={handleClick}
              value="done"
            >
              {t('common:finished')}
            </button>
          )}
        </Tab>

        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={
                selected
                  ? "bg-white text-black border border-gray-400 font-medium text-sm rounded-r-md order-1 py-2 px-4 hover:bg-indigo-400 bg-indigo-400 xs:p-0 xs:px-4 xs:py-2"
                  : "bg-white text-black border border-gray-400 font-medium text-sm rounded-r-md order-1 py-2 px-4 hover:bg-indigo-400 xs:p-0 xs:px-4 xs:py-2"
              }
              onClick={handleClick}
              value="all"
            >
              {t('common:all')}
            </button>
          )}
        </Tab>
      </Tab.List>
    </Tab.Group>
  );
}
