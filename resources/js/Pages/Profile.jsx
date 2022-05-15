import React, { useState, useRef, useContext } from 'react';
import { usePage, useForm } from '@inertiajs/inertia-react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { UserContext } from './reducer';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Profile({ user, roles }) {
  const { state, dispatch } = useContext(UserContext);
/*  const { auth } = usePage().props;
  const user = auth.user;*/
  console.log(roles);

  const fileInput = useRef();

  const { data, setData, post } = useForm({
    password: '',
    avatar: undefined,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
  });

  const [newPassword, setNewPassword] = useState('');
  const [avatarFormImg, setAvatarFormImg] = useState(user.avatar || '/img/no-user-photo.jpg');
  const passwordsMatch = () => data.password === newPassword;

  const onAvatarChange = (e) => {
    setData('avatar', e.target.files[0]);
    const reader = new FileReader();
    reader.onload = function (ev) {
      setAvatarFormImg(ev.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const onClear = () => {
    setNewPassword('');
    setData('password', '');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (passwordsMatch()) {
      post('/profile/edit', {
        onSuccess: (resp) => {
          dispatch({
            type: 'SHOW_NOTIFICATION',
            payload: {
              position: 'bottom',
              type: 'success',
              header: 'Success!',
              message: 'Profile data updated!'
            }
          });
          setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
        }
      });
      onClear();
    }
  };

  return (
    <>
      <header>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 text-center">User Profile</h1>
        </div>
      </header>
      <main>
        <div className="flex flex-col place-items-center">
          <div className="my-6 overflow-x-auto mx-2 sm:-mx-6 lg:-mx-8 max-w-2xl">
            <form
              className="space-y-8 divide-y divide-gray-200"
              method="POST"
              onSubmit={onSubmit}
            >
              <div className="space-y-8 divide-y divide-gray-200">

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="flex flex-wrap sm:col-span-6 content-center">
                    <label htmlFor="photo" className="w-full block text-sm font-medium text-gray-700">
                      Avatar
                    </label>
                    <div className="mt-1 w-full grid grid-cols-12 gap-x-6 items-center">
                      <span className="w-10 h-10 flex justify-center rounded-full overflow-hidden bg-gray-100 col-span-2">
                        <img src={avatarFormImg} alt="avatar" />
                      </span>
                      <input
                        ref={fileInput}
                        type="file"
                        name="avatar"
                        id="avatar"
                        onChange={onAvatarChange}
                        className="form-control
                          block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          col-span-10
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
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
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone number
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        autoComplete="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      New password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={data.password}
                        autoComplete="password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Repeat new password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="password"
                        name="new_password"
                        id="new_password"
                        autoComplete="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={classNames(
                          !passwordsMatch() ? 'border-red-300' : 'border-gray-300',
                          'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md'
                        )}
                        aria-invalid={!passwordsMatch()}
                      />
                      {!passwordsMatch()
                        && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      }
                    </div>
                    {!passwordsMatch()
                      && <p className="mt-2 text-sm text-red-600" id="password-error">
                        Passwords don't match
                      </p>
                    }

                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-center py-1">
                  {
                  //   <button
                  //   type="button"
                  //   className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  //   onClick={onClear}
                  // >
                  //   Clear
                  // </button>
                  }
                  <button
                    type='submit'
                    className={classNames(
                      passwordsMatch() ? '' : 'opacity-50 cursor-not-allowed',
                      'ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    )}
                    disabled={!passwordsMatch()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
