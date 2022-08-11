import React, {useContext, useRef, useState} from "react";
import {Inertia} from "@inertiajs/inertia";
import {useForm, usePage} from "@inertiajs/inertia-react";
import {AdminContext} from "../reducer.jsx";
import Header from "../../Components/AdminPages/Header.jsx";
import Access from "../../Components/Access.jsx";
import PermissionList from "../../Components/PermissionList.jsx";
import {Switch} from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {useTranslation} from "react-i18next";
import Page, { ActionButton, ButtonsRow, CancelButton } from '../../Components/AdminPages/Page';
import { OptionsList,
  OptionItem,
  OptionItemName,
  OptionItemInputField,
  OptionItemInputEmailField,
  OptionItemInputPhoneField,
  OptionItemErrorText,
  OptionItemSwitchField,
  OptionItemAccessField
} from '../../Components/AdminPages/OptionsList';
import {root} from "postcss";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EditUser({user, permissions, permissionHistory}) {
  const {state, dispatch} = useContext(AdminContext);
  const {errors} = usePage().props;

  const { t } = useTranslation(['common', 'users']);

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
    <Page>
      <Header title={!user?.id
        ? t('users:createUser')
        : t('users:editUser')}/>

      <OptionsList>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('common:name')}</OptionItemName>
          <OptionItemInputField
            value={data.name}
            onChange={(e) => setData("name", e)}
          />
          <OptionItemErrorText errorText={errors.name} />
        </OptionItem>

        <OptionItem className="bg-white-50">
          <OptionItemName>{t('users:lastName')}</OptionItemName>
          <OptionItemInputField
            value={data.last_name}
            onChange={(e) => setData("last_name", e)}
          />
          <OptionItemErrorText errorText={errors.last_name} />
        </OptionItem>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('common:email')}</OptionItemName>
          <OptionItemInputEmailField
            value={data.email}
            onChange={(e) => setData("email", e)}
          />
          <OptionItemErrorText errorText={errors.name} />
        </OptionItem>

        <OptionItem className="bg-white-50" >
          <OptionItemName>{t('common:phone')}</OptionItemName>
          <OptionItemInputPhoneField
            value={data.phone}
            onChange={(e) => setData("phone", e)}
          />
          <OptionItemErrorText errorText={errors.phone} />
        </OptionItem>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('users:password')}</OptionItemName>
          <div className=" block w-full mt-1 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md">
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className={classNames(
                !passwordsMatch() ? "border-red-300" : "border-gray-300",
                "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              )}
            />
          </div>
          {!passwordsMatch() && (<OptionItemErrorText errorText={errors.password} />)}
        </OptionItem>

        <OptionItem className="bg-white-50">
          <OptionItemName>{t('users:repeatPassword')}</OptionItemName>
          <div className=" block w-full mt-1 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={classNames(
                !passwordsMatch() ? "border-red-300" : "border-gray-300",
                "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              )}
            />
          </div>
          {!passwordsMatch() && (<OptionItemErrorText errorText={errors.password} />)}
        </OptionItem>

        <OptionItem className="bg-gray-50 sm:grid-cols-2">
          <OptionItemName>{t('common:image')}</OptionItemName>
          <div className="flex flex-col w-3/4">
            <div className="w-full mb-4 flex justify-center rounded-md overflow-hidden bg-white col-span-2">
              <div className="w-full">
                <img className="max-h-[340px] w-full object-cover shadow-lg rounded-lg" src={userImg ?? '/img/noimage.jpg'} alt="course image"/>
              </div>
              <span className="bg-white">
                  <XIcon
                    className="w-5 h-5 mx-1 text-red-600 hover:text-red-900 cursor-pointer"
                    onClick={() => removeUserImage()}
                  />
                </span>
            </div>
            <div className="relative">
              <input
                ref={userImgInput}
                accept="image/*"
                type="file"
                name="avatar"
                id="avatar"
                onChange={onUserImgChange}
              />
            </div>
          </div>
        </OptionItem>

        <OptionItem className="bg-white">
          <OptionItemName>{t('users:administrator')}</OptionItemName>
          <OptionItemSwitchField
            value={data.admin}
            onChange={(e) => {setData('admin', e); errors.admin = '';}}
          />
        </OptionItem>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('lc:availableFor')}</OptionItemName>
          <OptionItemAccessField
            permissions={data.permissions}
            setPermission={setPermission}
            visibleTypes={['U', 'D', 'T', 'O']}
            permissionHistory={permissionHistory}
          />
        </OptionItem>

        <OptionItem className="bg-white-50">
          <OptionItemName></OptionItemName>
          <PermissionList permissions={data.permissions} removePermission={removePermission} />
        </OptionItem>

      </OptionsList>

      <ButtonsRow>
        <CancelButton className='sm:col-start-1' label={t('common:cancel')} onClick={() => Inertia.get(route("admin.users"))}/>
        <ActionButton className='sm:col-start-3' label={t('common:save')} onClick={() => {
          if (user?.id) {
            post(route("admin.user.update", user.id), {data});
          } else {
            post(route("admin.user.create"));
          }
        }}/>
      </ButtonsRow>

    </Page>
  );
}
