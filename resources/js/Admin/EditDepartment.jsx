import React, { useEffect, useContext } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { AdminContext } from './reducer.jsx';


export default function EditDepartments({ department, allDepartaments, allUsers }) {
  const { state, dispatch } = useContext(AdminContext);
  
  const { auth } = usePage().props

  const { data, setData, post } = useForm({
    head: department.head ?? auth.user.id,
    name: department.name ?? '',
    parent: department.parent ?? '',
  });

  const handleParentChange = (inputValue) => {
    setData('parent', inputValue && inputValue.value);
  };

  const clearParent = () => {
    setData('parent', department.parent ?? '');
  }

  const handleHeadChange = (inputValue) => {
    setData('head', inputValue && inputValue.value);
  };

  const clearHead = () => {
    setData('head', auth.user.id);
  }

  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER', payload: department.id === undefined ? 'Создание  департамента' : `Редактирование департамента`
    });
  }, []);

    return(
        <main className="bg-white shadow rounded-md">
          <div className="border-t border-gray-200">
           <ul>
              <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center">
                <span className="text-sm font-medium text-gray-500">Название департамента</span>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                />
              </li>
              <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center">
                <span className="text-sm font-medium text-gray-500">Глава департамента</span>
                  <Select 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                    options={allUsers}
                    defaultValue={{value: data.head, label: allUsers.find((item) => item.value === data.head).label}}
                    isClearable={clearHead}
                    onChange={handleHeadChange}
                    />
              </li>
              <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center">
                <span className="text-sm font-medium text-gray-500">Родительский департамент</span>
                {console.log('dParent', data.parent)}
                  <Select 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                    options={allDepartaments}
                    placeholder='Это департамент верхнего уровня'
                    defaultValue={
                      data.parent === '' || data.parent === null 
                        ? null 
                        : {
                          value: data.parent, 
                          label:allDepartaments.find((item) => item.value === data.parent).label
                        }
                    }
                    isClearable={clearParent}
                    onChange={handleParentChange}
                    />
              </li>
            </ul>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
                onClick={() => {
                  if (department.id !== undefined) { post(route('admin.department.edit', department.id), { data });
                  } else {
                    post(route('admin.department.create'), {
                      data, onSuccess: (res) => {
                        dispatch({
                          type: 'SHOW_NOTIFICATION',
                          payload: {
                            position: 'bottom',
                            type: 'success',
                            header: 'Success!',
                            message: 'New Department created!',
                          }
                        });
                        setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                      }
                    });
                  }
                }}
              >
                Сохранить
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => Inertia.get(route('admin.departments'))}
              >
                Отмена
              </button>
            </div>
          </div>
        </main>
    ) 
}
