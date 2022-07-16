import React from 'react';
import {MailIcon, PencilIcon, TrashIcon} from '@heroicons/react/outline';

const ActionsCell = ({value: actions, row: {index}, column: {id}}) => {

  return (
    <div
      className="m-auto justify-center text-center font-medium inline-flex"
    >
      {actions.map((action) => (
        (() => {
          switch (action.type) {
            case 'edit':
              return <PencilIcon
                key={action.type}
                className={`w-5 h-5 mx-1 ${action.disabled ? 'text-gray-300' : 'text-indigo-600 hover:text-indigo-900 cursor-pointer'}`}
                onClick={action.disabled ? null : action.action}
              />;
            case 'delete':
              return <TrashIcon
                key={action.type}
                className={`w-5 h-5 mx-1 ${action.disabled ? 'text-gray-300' : 'text-red-600 hover:text-red-900 cursor-pointer'}`}
                onClick={action.disabled ? null : action.action}
              />;
            case 'resend':
              return <MailIcon
                key={action.type}
                className={`w-5 h-5 mx-1 ${action.disabled ? 'text-gray-300' : 'text-indigo-600 hover:text-indigo-900 cursor-pointer'}`}
                onClick={action.disabled ? null : action.action}
              />;
            case 'select':
              return <button
                key={action.type}
                type="button"
                className={
                  `${action.selected
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}
                  inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2`
                }
                onClick={action.action}
              >
                {action.name}
              </button>;
            default:
              return null;
          }
        })()
      ))}
    </div>
  );
};

export default ActionsCell;
