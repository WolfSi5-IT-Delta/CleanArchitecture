import React from "react";

function classNames(...classes) {
   return classes.filter(Boolean).join(' ')
}
 
export default function Page({ children }) {
  return (
    <main className="w-full h-fit">
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
        {children}
      </div>
    </main>
  );
}

export const ButtonsRow = ({ children }) => {
  return (
    <div className="mt-8 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
      {children}
    </div>
  );
};

export const Button = ({ label, onClick, className }) => {
  return (
    <button
      type="button"
      className={classNames(className, 'w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm')}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export const CancelButton = ({ label, onClick, className }) => {
   return (
      <Button
         label={label}
         className={classNames(className, 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}
         onClick={onClick}
     />
   );
 };

 export const ActionButton = ({ label, onClick, className }) => {
   return (
      <Button
         label={label}
         className={classNames(className, 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700')}
         onClick={onClick}
     />
   );
 };