import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Components/Modal.jsx';
import { AsyncPaginate } from "react-select-async-paginate";

// hardcoded presets of user types
const stdMapFunction = (items) => {
  return (
    items?.map((e) => ({
      value: e.id,
      label: e.name,
    })) ?? []
  )
}

const allPermissionTypes = [
  {
    name: 'Users',
    id: 'U',
    search: true,
    routeName: 'getAllUsers',
    mapFunction: (users) => {
      return (
        users?.map((e) => ({
          value: e.id,
          label: `${e.name} ${e.last_name}`.trim(),
        })) ?? []
      );
    }
  },
  {
    name: 'Teams',
    id: 'T',
    search: true,
    routeName: 'getAllTeams',
    mapFunction: stdMapFunction
  },
  {
    name: 'Posts',
    id: 'P',
    search: true,
  },
  {
    name: 'Departments',
    id: 'D',
    search: true,
    routeName: 'getAllDepartments',
    mapFunction: stdMapFunction
  },
  {
    name: 'Others',
    id: 'O',
  }
];

export default function Access({
  permissions,
  addPermission,
  removePermission,
  data,
  visibleTypes = ['U', 'T', 'O'],
}) {

  const [permTypes, setPermTypes] = useState(allPermissionTypes.reduce((types, type) => {
    if (visibleTypes.includes(type.id)) {
      types.push(type);
    }
    return types;
  }, []));

  const [currentPermType, setCurrentPermType] = useState(allPermissionTypes[0]);
  const [showAccessModal, setShowAccessModal] = useState(false);

  const [permValues, setPermValues] = useState([]);
  const loadPermissions = async (search, loadedOptions, { page }) => {
    const mapFunction = currentPermType.mapFunction;
    // prepare the query
    const sel = permissions.filter(e => e.type === currentPermType.id).map(e => e.id);
    let query = [
      search ? `search=${search}` : null,
      sel.length ? `selected=[${sel.toString()}]` : null,
      page !== 1 ? `page=${page}` : null
    ].filter(e => e).join('&');

    const url = route(currentPermType.routeName);
    const result = await axios.get(`${url}?${query}`);

    return {
      options: mapFunction(result.data.data),
      hasMore: result.data.next_page_url !== null,
      additional: {
        page: result.data.current_page + 1,
      },
    };
  };

  const PermissionTypeSelector = () => {
    return (
      <div className="block mb-4">
        <div className="text-center">Select {currentPermType.name}</div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {permTypes.map((permissionItem) => (
              <div
                key={permissionItem.id}
                className={
                  `${permissionItem == currentPermType
                    ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  w-full py-2 px-1 text-center border-b-2 font-medium text-sm cursor-pointer`
                }
                onClick={() => {
                  setCurrentPermType(permissionItem);
                }}
              >
                {permissionItem.name}
              </div>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  const DataList = () => {
    return (
      <div className="w-full flex flex-wrap">
        <div className="w-full h-60 sm:w-1/2 overflow-y-auto">
          <div className="mt-1 mx-1 py-0.5 rounded-full text-xs text-center font-light bg-gray-100">Last items</div>
          <ul role="list" className="bg-white">
            {data.filter(item => item.type === currentPermType.id).map((item, idx) => {
              item.selected = permissions.some(e => (e.id == item.id && e.type == item.type));
              return (
                <li
                  key={`perm${item.type}_${item.id}`}
                  className={`text-xs py-2 pl-2 flex cursor-pointer hover:bg-gray-50
                    ${item.selected ? 'font-bold':''}`
                  }
                  onClick={() => {
                    if (!item.selected) {
                      addPermission(item);
                    } else {
                      removePermission(item);
                    }
                  }}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
          {/*{!currentPermType.isLastPage &&*/}
          {/*  <button*/}
          {/*    type="button"*/}
          {/*    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"*/}
          {/*    onClick={() => {*/}
          {/*      setIsLoading(true);*/}
          {/*      fetchUsers(true);*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    Load more...*/}
          {/*  </button>*/}
          {/*}*/}
        </div>
        <ul role="list" className="border-l p-1 bg-white w-full sm:w-1/2">
          {permissions.map((item) => {
            return (
              <li
                key={`ss${item.type}_${item.id}`}
                className="inline-flex items-center py-0.5 pl-2 pr-0.5 m-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700
                  cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  removePermission(item);
                }}
              >
                {item.name}
                <button
                  type="button"
                  className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 focus:outline-none focus:bg-gray-500 focus:text-white"
                >
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7"/>
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <>
      <button
        type="button"
        className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
        onClick={()=>setShowAccessModal(true)}
      >
        Назначить пользователей
      </button>

      <Modal
        open={showAccessModal}
        onClose={()=>setShowAccessModal(false)}
      >
        <PermissionTypeSelector/>
        {/*<input*/}
        {/*  type="text"*/}
        {/*  className="shadow-sm mt-5 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300"*/}
        {/*  placeholder="Search"*/}
        {/*  value={searchStringBuffer}*/}
        {/*  onChange={(e) => {*/}
        {/*    setSearchStringBuffer(e.target.value);*/}
        {/*  }}*/}
        {/*/>*/}
        {/*{currentPermType.search ? (*/}
          <AsyncPaginate
            classNames={"overflow-visible"}
            placeholder="Search"
            maxMenuHeight={150}
            menuPlacement="auto"
            defaultOptions
            isDisabled={!currentPermType.search}
            loadOptions={loadPermissions}
            additional={{ page: 1 }}
            value={permValues}
            cacheUniqs={[currentPermType, permissions]}
            onChange={(e) => {
              setPermValues([]);
              addPermission({
                type: currentPermType.id,
                id: e.value,
                name: e.label
              })
            }}
          />
        {/*) : ""}*/}

        <DataList/>
        <button
         className='mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
         onClick={()=>setShowAccessModal(false)}
         >
           Close
         </button>

      </Modal>
    </>
  );
}
