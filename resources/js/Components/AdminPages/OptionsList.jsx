import React from 'react';
import { Switch } from '@headlessui/react';
import Access from '../../Components/Access';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const OptionsList = ({children}) => {
  return (
    <ul>
      {children}
    </ul>
  );
}

export const OptionItem = ({children, className}) => {
  const col2 = className.includes('sm:grid-cols-2')
  return (
    <li className={classNames(className, 
                "px-4 py-5 sm:grid sm:gap-4 sm:px-6 rounded-t-md", 
                col2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
          )}>
      {children}
    </li>
  );
}

export const OptionItemName = ({children}) => {
  return (
    <span className="text-sm font-medium text-gray-500">{children}</span>
  );
}

export const OptionItemErrorText = ({errorText}) => {
  return (
    <>{errorText && <div className="text-sm font-medium text-red-500 text-red-600 col-end-3">{errorText}</div>}</>
  );
}

export const OptionItemInputField = ({value, onChange}) => {
  return (
    <input
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export const OptionItemSwitchField = ({value, onChange}) => {
  return (
    <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      <Switch
        checked={Boolean(value)}
        onChange={(e) => onChange(e)}
        className={`
        ${Boolean(value) ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        `}
      >
        <span className="sr-only">Course state</span>
          <span
            className={`
            ${Boolean(value) ? 'translate-x-5' : 'translate-x-0'}
              'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
              `}
          >
            <span
              className={`
              ${Boolean(value) ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'}
              absolute inset-0 h-full w-full flex items-center justify-center transition-opacity
              `}
              aria-hidden="true"
            >
              <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                <path
                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className={`${Boolean(value) ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
              aria-hidden="true"
            >
              <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                <path
                  d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"/>
              </svg>
            </span>
          </span>
      </Switch>
    </span>

  );
}


export const OptionItemTextAreaField = ({value, onChange}) => {
  return (
    <textarea
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export const OptionItemAccessField = ({permissions, permissionHistory, visibleTypes, setPermission}) => {
  return (
    <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      <Access
        permissions={permissions}
        setPermission={setPermission}
        visibleTypes={visibleTypes}
        permissionHistory={permissionHistory}
      />
    </span>
  );
}