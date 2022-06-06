import React, {useContext, useRef, useState} from "react";
import {Inertia} from "@inertiajs/inertia";
import {useForm, usePage} from "@inertiajs/inertia-react";
import {AdminContext} from "../reducer.jsx";
import Header from "../../Components/Header.jsx";
import Access from "../../Components/Access.jsx";
import PermissionList from "../../Components/PermissionList.jsx";
import {Switch} from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EditUser({user, permissions, permissionHistory}) {
  const {state, dispatch} = useContext(AdminContext);
  const {errors} = usePage().props;

  const {data, setData, post} = useForm({
    name: user?.name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    avatar: user?.avatar ?? "",
    password: user?.password ?? "",
    admin: user?.admin ?? false,
    permissions
  });

  const [newPassword, setNewPassword] = useState("");
  const passwordsMatch = () => data?.password === newPassword;
  const userImgInput = useRef();
  const [userImg, setUserImg] = useState(user?.avatar || "/img/no-user-photo.jpg");

  const removeUserImage = () => {
    setUserImg("/img/no-user-photo.jpg")
    setData("avatar", null);
  };

  const onUserImgChange = (e) => {
    setData("avatar", e.target.files[0]);
    const reader = new FileReader();
    reader.onload = function (ev) {
      setUserImg(ev.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const setPermission = (items) => {
    setData('permissions', items);
  }
  const removePermission = (item) => {
    setData('permissions', data.permissions.filter(e => (e.id !== item.id || e.type !== item.type)));
  }

  return (
    <main>
      <div className="border-t border-gray-200 bg-white shadow rounded-xl">
        <Header title={!user?.id
          ? "Создание нового пользователя"
          : `Редактирование пользователя`}/>
        <div className="px-4 py-5 sm:px-6">
        </div>
        <ul>
          <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center">
            <span className="text-sm font-medium text-gray-500">Имя </span>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
            />
            {errors.name && <div className="text-sm font-medium text-red-500 text-red-600 col-end-3">{errors.name}</div>}
          </li>
          <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center">
            <span className="text-sm font-medium text-gray-500">Фамилия </span>
            <input
              type="text"
              value={data.last_name}
              onChange={(e) => setData("last_name", e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
            />
          </li>
          <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center">
            <span className="text-sm font-medium text-gray-500">Почта</span>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
            />
            {errors.email && <div className="text-sm font-medium text-red-500 text-red-600 col-end-3">{errors.email}</div>}
          </li>
          <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center">
            <span className="text-sm font-medium text-gray-500">Телефон</span>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => setData("phone", e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
            />
          </li>
          <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center">
            <span className="text-sm font-medium text-gray-500">Пароль </span>
            <div className=" block w-full mt-1 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md">
              <input
                type="text"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className={classNames(
                  !passwordsMatch() ? "border-red-300" : "border-gray-300",
                  "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                )}
              />
              {!passwordsMatch() && (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  Passwords don't match
                </p>
              )}
            </div>
          </li>
          <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center">
            <span className="text-sm font-medium text-gray-500">
              Повторите пароль{" "}
            </span>
            <div className=" block w-full mt-1 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md">
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={classNames(
                  !passwordsMatch() ? "border-red-300" : "border-gray-300",
                  "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                )}
              />
              {!passwordsMatch() && (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  Passwords don't match
                </p>
              )}
            </div>
          </li>
          <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
            <span className="text-sm font-medium text-gray-500">
              Фото пользователя
            </span>
            <div className="flex flex-col w-3/4">
              <div className="w-full mb-4 flex justify-center rounded-md overflow-hidden bg-white col-span-2">
              <div className="w-full">
                <img className="max-h-[560px] w-full object-cover shadow-lg rounded-lg" src={userImg ?? "/img/no-user-photo.jpg"} alt="user image" />
              </div>
                <span className="mr-4 bg-white">
                  <XIcon
                    className="w-5 h-5 mx-1 text-red-600 hover:text-red-900 cursor-pointer"
                    onClick={() => removeUserImage()}
                  />
                </span>
              </div>
              <input
                ref={userImgInput}
                type="file"
                name="avatar"
                id="avatar"
                onChange={onUserImgChange}
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 col-span-10 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </li>
          <li className="bg-white px-4 py-5 grid grid-cols-2 sm:grid-cols-3 sm:gap-4 sm:px-6">
            <span className="text-sm font-medium text-gray-500 flex items-center sm:block">Administrator</span>
            <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Switch
                    checked={data.admin}
                    onChange={(e) => {setData('admin', e);}}
                    className={`
                    ${data.admin ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    `}
                  >
                    <span className="sr-only">Administrator</span>
                    <span
                      className={`
                      ${data.admin ? 'translate-x-5' : 'translate-x-0'}
                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                        `}
                    >
                      <span
                        className={`
                        ${data.admin ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'}
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
                        className={`${data.admin ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
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
          </li>
          <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <span className="text-sm font-medium text-gray-500 flex items-center sm:block">Доступы</span>
            <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Access
                  permissions={data.permissions}
                  // addPermission={addPermission}
                  // removePermission={removePermission}
                  setPermission={setPermission}
                  visibleTypes={['D', 'T']}
                  permissionHistory={permissionHistory}
                />
              </span>
          </li>
          <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-b-md">
            <div></div>
            <PermissionList permissions={data.permissions} removePermission={removePermission}/>
          </li>
        </ul>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
          <button
            type="button"
            disabled={!passwordsMatch()}
            className={classNames(
              passwordsMatch() ? "" : "opacity-50 cursor-not-allowed",
              "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
            )}
            onClick={() => {
              if (user?.id) {
                post(route("admin.user.update", user.id), {data});
              } else {
                post(route("admin.user.create"));
              }
            }}
          >
            Сохранить
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            onClick={() => Inertia.get(route("admin.users"))}
          >
            Отмена
          </button>
        </div>
      </div>
    </main>
  );
}
