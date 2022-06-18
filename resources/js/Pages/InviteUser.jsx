import React, {useContext, useRef} from 'react'
import {InertiaLink, useForm, usePage} from '@inertiajs/inertia-react'
import {UserContext} from "./reducer";
import Access from '../Components/Access';
import PermissionList from "../Components/PermissionList";

export default function InviteUser({ permissionHistory }) {
  const {state, dispatch} = useContext(UserContext);

  const {data, setData, post} = useForm({
    email: '',
    permissions: []
  });

  const removePermission = (item) => {
    setData('permissions', data.permissions.filter(e => (e.id !== item.id || e.type !== item.type)));
  }

  const setPermission = (items) => {
    setData('permissions', items);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('invite-user'), /*{
      onSuccess: (resp) => {
        dispatch({
          type: 'SHOW_NOTIFICATION',
          payload: {
            position: 'bottom',
            type: 'success',
            header: 'Success!',
            message: 'The invite has been sent successfully!'
          }
        });
        setTimeout(() => dispatch({type: 'HIDE_NOTIFICATION'}), 3000);
      }
    }*/);
  };

  return (
    <>
      <header>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 text-center">Invite user</h1>
        </div>
      </header>
      <main>
        <div className="container mx-auto max-w-xl">
          <div className="mx-6 sm:mx-1">
            <form
              className="space-y-8 divide-y divide-gray-200"
              method="POST"
              onSubmit={onSubmit}
            >
              <div className="space-y-8">

                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Invite to:
                </label>
                <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <Access
                        permissions={data.permissions}
                        setPermission={setPermission}
                        visibleTypes={['T', 'D']}
                        permissionHistory={permissionHistory}
                      />
                </span>

                <PermissionList
                  permissions={data.permissions}
                  removePermission={removePermission}
                />

              </div>

              <div className="pt-5">
                <div className="flex justify-center py-1">
                  <button
                    type='submit'
                    className='min-w-[40%] inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium
                      rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                      '
                  >
                    Sent
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
