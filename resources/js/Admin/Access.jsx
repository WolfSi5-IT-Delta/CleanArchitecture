import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Components/Modal.jsx';

// hardcoded presets of user types
const allUserTypes = [
  {
    name: 'Users',
    id: 'U',
    current: true,
    shown: false,
    search: false,
    currentPage: 1,
    isLastPage: false
  },
  {
    name: 'Positions',
    id: 'P',
    current: false,
    shown: false,
    search: false,
    currentPage: 1,
    isLastPage: false
  },
  {
    name: 'Departments',
    id: 'DM',
    current: false,
    shown: false,
    search: false,
    currentPage: 1,
    isLastPage: false
  },
  {
    name: 'Working Groups',
    id: 'WG',
    current: false,
    shown: false,
    search: false,
    currentPage: 1,
    isLastPage: false
  },
  {
    name: 'Others',
    id: 'O',
    current: false,
    shown: false,
    search: false,
    currentPage: 1,
    isLastPage: false
  }
];

/**
 * Props selectedUsers and setSelectedUsers comes from parents useState
 * That allows Access component to be controlled by parent like controlled input
 */
export default function Access({
  data,
  setData,
  selectedUsers,
  setSelectedUsers,
  visibleTypes = ['U', 'DM'],
  currentResource = false, // e. g. LC1
  actions = ['read']
}) {
  // shown in userTypes is used for prevent unnecessary requests to server
  const [userTypes, setUserTypes] = useState(allUserTypes.reduce((types, type) => {
    if (visibleTypes.includes(type.id)) {
      types.push(type);
    }
    return types;
  }, []));
  const [searchString, setSearchString] = useState('');
  const [searchStringBuffer, setSearchStringBuffer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResourceUsersFetched, setIsResourceUsersFetched] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const getCurrentUserType = () => userTypes.find((type) => type.current === true);
  const setCurrentUserType = (id) => {
    setUserTypes((prev) => {
      prev.forEach((item) => {
        id === item.id
          ? item.current = true
          : item.current = false;
      });
      return [...prev];
    });
  };
  const selectUser = (user) => {
    if (data.find(item => item.id === user.id && item.type === user.type) !== undefined) {
      setData((prev) => {
        const idx = prev.findIndex((item) => item.type === user.type && item.id === user.id);
        prev[idx].selected = true;
        return [...prev];
      });
      setSelectedUsers((prev) => {
        return [...prev, user];
      });
    }
  };
  const removeUser = (user) => {
    setData((prev) => {
      const idx = prev.findIndex((item) => item.type === user.type && item.id === user.id);
      idx !== -1 ? prev[idx].selected = false : null;
      return [...prev];
    });
    setSelectedUsers((prev) => {
      const idx = prev.findIndex((item) => item.type === user.type && item.id === user.id);
      prev.splice(idx, 1);
      return [...prev];
    });
  };
  const fetchUsers = (nextPage = false) => {
    setIsLoading(true);
    const loading = isLoading; // to prevent access to isLoading from closure
    new Promise((resolve, reject) => {
      const currentUserType = getCurrentUserType();
      if ((
        !currentUserType.shown
        || (searchString !== '' && currentUserType.search !== searchString)
        || (searchString === '' && currentUserType.search !== false)
        || data.findIndex((item) => item.type === currentUserType.id) === -1
        || nextPage) && !loading
      ) {

        // url for request
        let resource;
        switch (currentUserType.id) {
          case 'U':
            resource = route('getAllUsers');
            break;
          case 'P':
            resource = 'positions'; // WARN replace when endpoint will be created
            break;
          case 'DM':
            resource = route('getAllDepartments');
            break;
          case 'WG':
            resource = 'working-groups'; // WARN replace when endpoint will be created
            break;
          case 'O':
            resource = 'others'; // WARN replace when endpoint will be created
            break;
          default:
            resource = route('getAllUsers');
            break;
        }

        // url params for request
        const params = [
          nextPage ? `page=${currentUserType.currentPage + 1}` : '',
          searchString !== '' ? `search=${searchString}` : ''
        ]
          .reduce((str, el, idx) => {
            if (el !== '') {
              if (str !== '') {
                return `${str}&${el}`;
              }
              return el;
            }
            return str;
          }, '');

        axios
          .get(`${resource}?${params}`)
          .then((allDataResp) => {
            const {current_page: currentPage, last_page: lastPage} = allDataResp.data;

            setUserTypes((prev) => {
              const idx = prev.findIndex((type) => type.current === true);
              prev[idx].shown = true;
              if (searchString !== '' && searchString !== prev[idx].search) {
                prev[idx].search = searchString;
              } else if (searchString === '') {
                prev[idx].search = false;
              }
              currentPage === lastPage
                ? prev[idx].isLastPage = true
                : prev[idx].isLastPage = false;
              return [...prev];
            });

            let data;
            if (currentResource !== false && !isResourceUsersFetched) {
              axios
                .get(`${route('access.getResourceUsers')}?resource=${currentResource}&actions=${JSON.stringify(actions)}`)
                .then((selectedUsersResp) => {
                  const receivedSelectedUsers = selectedUsersResp.data;

                  setSelectedUsers((prev) =>[...prev, ...receivedSelectedUsers]);

                  setIsResourceUsersFetched(true);
            
                  data = allDataResp.data.data.map((item) => {
                    item.selected = !!receivedSelectedUsers.find((user) => user.type === currentUserType.id && user.id === item.id);
                    item.searchedBy = searchString;
                    return item;
                  });
                
                  
                  setData((prev) => {
                    const filteredPrev = prev.filter((item) => item.searchedBy === searchString);
                    return [...filteredPrev, ...data];
                  });
                });
                resolve();
              } else {
          
              data = allDataResp.data.data.map((item) => {
                item.selected = !!selectedUsers.find((user) => user.type === currentUserType.id && user.id === item.id);
                item.searchedBy = searchString;
                return item;
              });

              setData((prev) => {
                const filteredPrev = prev.filter((item) => item.searchedBy === searchString);
                return [...filteredPrev, ...data];
              });
              resolve();
            }
          });
      } else {
        reject();
      }
    })
      .then(()=> {
        setIsLoading(false);
      })
      .catch(()=> {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [userTypes, searchString, showAccessModal, selectedUsers]);

  useEffect(() => {
    if (!isLoading) { setSearchString(searchStringBuffer); }
  }, [isLoading, searchStringBuffer]);


  const UserGroupSelector = () => {
    return (
      <div className="block">
        <div className="text-center">Select {userTypes[0].name ? getCurrentUserType().name : null} Group</div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {userTypes.map((userType) => (
              <div
                key={userType.id}
                className={
                  `${userType.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  w-full py-4 px-1 text-center border-b-2 font-medium text-sm cursor-pointer`
                }
                onClick={() => setCurrentUserType(userType.id)}
              >
                {userType.name}
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
          <ul role="list" className="divide-y divide-gray-200 bg-white">
            {data.filter(item => item.type === getCurrentUserType().id).map((item) => {
              return (
                <li
                  key={item.id}
                  className={`py-2 pl-2 flex cursor-pointer ${item.selected ? 'bg-gray-50 font-extrabold' : ' hover:bg-gray-50'}`}
                  onClick={() => {
                    if (item.selected === false) {
                      selectUser({
                        type: getCurrentUserType().id,
                        id: item.id,
                        name: item.name
                      });
                    } else {
                      removeUser(item);
                    }
                  }}
                >{item.name}</li>
              );
            })}
          </ul>
          {!getCurrentUserType().isLastPage &&
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={() => {
                setIsLoading(true);
                fetchUsers(true);
              }}
            >
              Load more...
            </button>
          }
        </div>
        <ul role="list" className="border-l p-1 bg-white w-full sm:w-1/2">
          {selectedUsers.map((item) => {
            return (
              <li
                key={`${item.type}_${item.id}`}
                className="inline-flex items-center py-0.5 pl-2 pr-0.5 m-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {item.name}
                <button
                  type="button"
                  className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none focus:bg-gray-500 focus:text-white"
                  onClick={() => {
                    removeUser(item);
                  }}
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
      <UserGroupSelector/>
      <input
        type="text"
        className="shadow-sm mt-5 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300"
        placeholder="Search"
        value={searchStringBuffer}
        onChange={(e) => {
          setSearchStringBuffer(e.target.value);
        }}
      />
      <DataList/>
      <button
       className='mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
       onClick={()=>setShowAccessModal(false)}
       >
         Save
       </button>

      </Modal>
    </>
  );
}
