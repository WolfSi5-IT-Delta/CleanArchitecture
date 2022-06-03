import { PencilIcon, XIcon } from "@heroicons/react/outline";
import React from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import StatusCell from "./Table/Cell/StatusCell";

const DragHandle = SortableHandle(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
  </svg>
));
const SortableItem = SortableElement(({ value, onEdit, onDelete, status }) => {
  return (
    <li className="flex rounded-md w-4/5 relative -mb-px block border p-4 border-grey flex justify-between">
      <span className="flex-none mr-2" >
      <DragHandle />
      </span>
      {status ? 
      (
        <span className="flex-none w-20">
          <StatusCell value={value.active} className=""/>
        </span>
      )
      :null
      }
      <span className="flex-grow text-ellipsis overflow-hidden text-center">{value.name}</span>
      <span className="flex justify-between">
        <span>
          <PencilIcon
            className="w-5 h-5 mx-1 text-blue-600 hover:text-red-900 cursor-pointer"
            onClick={() => onEdit(value)}
          />
        </span>
        <span>
          <XIcon
            className="w-5 h-5 mx-1 text-red-600 hover:text-red-900 cursor-pointer"
            onClick={() => onDelete(value)}
          />
        </span>
      </span>
    </li>
  );
});

const SortableList = SortableContainer(({ items, onEdit, onDelete, status = false}) => {
  return (
    <ul className="list-reset flex flex-col sm:col-span-2 w-full ">
      {items?.map((value, index) => {
        return (
        <SortableItem
          key={`item-${index}`}
          index={value.order}
          value={value}
          onEdit={onEdit}
          onDelete={onDelete}
          status={status}
        />
      )})}
    </ul>
  );
});

export default SortableList;
