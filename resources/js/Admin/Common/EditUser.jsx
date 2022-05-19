import React, { useState, useRef, useEffect, useContext } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { AdminContext } from "../reducer.jsx";
import Header from "../../Components/Header.jsx";
import Access from "../../Components/Access.jsx";
import PermissionList from "../../Components/PermissionList.jsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EditUser({ user, permissions, permissionHistory }) {
  const { state, dispatch } = useContext(AdminContext);
  const {errors} = usePage().props;

  const { data, setData, post } = useForm({
    name: user?.name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    avatar: user?.avatar ?? "",
    password: user?.password ?? "",
    permissions
  });

  const [newPassword, setNewPassword] = useState("");
  const passwordsMatch = () => data?.password === newPassword;
  const userImgInput = useRef();
  const [userImg, setUserImg] = useState(user?.avatar || "/img/no-user-photo.jpg");

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
          <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <span className="text-sm font-medium text-gray-500">
              Фото пользователя
            </span>
            <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className="w-full mb-4 flex justify-center rounded-md overflow-hidden bg-gray-100 col-span-2">
                <img src={userImg} alt="user image" />
              </span>
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
            <PermissionList permissions={data.permissions} removePermission={removePermission} />
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
                post(route("admin.user.update", user.id));
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
