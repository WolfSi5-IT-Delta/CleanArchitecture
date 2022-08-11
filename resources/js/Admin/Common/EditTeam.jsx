import React, { useEffect, useContext } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { AsyncPaginate } from "react-select-async-paginate";
import { AdminContext } from "../reducer.jsx";
import axios from "axios";
import Header from "../../Components/AdminPages/Header.jsx";
import {useTranslation} from "react-i18next";
import Page, { ActionButton, ButtonsRow, CancelButton } from '../../Components/AdminPages/Page';
import {
  OptionsList,
  OptionItem,
  OptionItemName,
  OptionItemInputField,
  OptionItemErrorText,
  OptionItemTextAreaField
} from '../../Components/AdminPages/OptionsList';

export default function EditTeam({ team }) {
  const { state, dispatch } = useContext(AdminContext);
  const { auth } = usePage().props;

  const { t } = useTranslation(['common']);

  const mapUsers = (users) => {
    return (
      users?.map((e) => ({
        value: e.id,
        label: `${e.name} ${e.last_name}`.trim(),
      })) ?? []
    );
  };

  const { data, setData, errors, post } = useForm({
    name: "",
    description: "",
    users: [],
  });

  useEffect(() => {
    if (team) setData({
      name: team?.name,
      description: team?.description,
      users: mapUsers(team?.users),
    })
  }, [team]);

  const loadUsers = async (search, loadedOptions, { page }) => {
    const params = [
      search ? `search=${search}` : "",
      data.users.length !== 0 ? `selected=[${data.users.toString()}]` : "",
      page !== 1 ? `page=${page}` : "",
    ].reduce(
      (str, el, idx) => (el !== "" ? (str !== "" ? `${str}&${el}` : el) : str),
      ""
    );

    const result = await axios.get(`${route("getAllUsers")}?${params}`);

    return {
      options: mapUsers(result.data.data),
      hasMore: result.data.next_page_url !== null,
      additional: {
        page: result.data.current_page + 1,
      },
    };
  };

  return (
    <Page>
      <Header title={team?.id === undefined
        ? t('team:createTeam')
        : t('team:editTeam')}/>

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
          <OptionItemName>{t('common:description')}</OptionItemName>
          <OptionItemTextAreaField
            value={data.description}
            onChange={(e) => setData("description", e)}
          />
        </OptionItem>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('common:users')}</OptionItemName>
          <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <AsyncPaginate
                    className={"overflow-visible"}
                    isMulti
                    placeholder={t('common:add')}
                    maxMenuHeight={150}
                    menuPlacement="auto"
                    defaultOptions
                    loadOptions={loadUsers}
                    additional={{ page: 1 }}
                    value={data.users}
                    onChange={(e) => {
                      setData("users", e);
                    }}
                  />
                </span>
        </OptionItem>

      </OptionsList>

      <ButtonsRow>
        <CancelButton className='sm:col-start-1' label={t('common:cancel')} onClick={() => Inertia.get(route("admin.teams"))}/>
        <ActionButton className='sm:col-start-3' label={t('common:save')} onClick={() => {
          if (team?.id) {
            post(route("admin.team.update", team.id));
          } else {
            post(route("admin.team.create"));
          }
        }}/>
      </ButtonsRow>

    </Page>
    // <main>
    //
    //     <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200">
    //       <Header title={team?.id === undefined
    //       ? t('team:createTeam')
    //       : t('team:editTeam')}/>
    //     <div className="py-5">
    //
    //       {/* {Object.values(errors).length ? (
    //         <div className="px-4 py-5 sm:px-6 text-red-600 font-medium text-sm">
    //           <span>
    //             Errors:
    //           </span>
    //           {Object.values(errors).map((e, index) => (
    //             <span key={index} className="px-4">
    //               {e}
    //             </span>
    //           ))}
    //         </div>
    //       ) : ''} */}
    //
    //       <ul>
    //         <li className="py-5 sm:grid sm:grid-cols-3 sm:gap-4 align-items-center rounded-t-md">
    //           <span className="text-sm font-medium text-gray-500">
    //             {t('common:name')}
    //           </span>
    //           <input
    //             type="text"
    //             value={data.name}
    //             onChange={(e) => setData("name", e.target.value)}
    //             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
    //           />
    //           {errors.name && <div className="text-sm font-medium text-red-500 text-red-600 col-end-3">{errors.name}</div>}
    //         </li>
    //         <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4">
    //           <span className="text-sm font-medium text-gray-500">
    //             {t('common:description')}
    //           </span>
    //           <textarea
    //             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
    //             defaultValue={data.description}
    //             onChange={(e) => setData("description", e.target.value)}
    //           />
    //         </li>
    //         <li className="bg-white px-4 py-5 grid grid-cols-2 sm:grid-cols-3 sm:gap-4">
    //           <span className="text-sm font-medium text-gray-500 flex items-center sm:block">
    //             {t('common:users')}
    //           </span>
    //           <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
    //             <AsyncPaginate
    //               className={"overflow-visible"}
    //               isMulti
    //               placeholder={t('common:add')}
    //               maxMenuHeight={150}
    //               menuPlacement="auto"
    //               defaultOptions
    //               loadOptions={loadUsers}
    //               additional={{ page: 1 }}
    //               value={data.users}
    //               onChange={(e) => {
    //                 setData("users", e);
    //               }}
    //             />
    //           </span>
    //         </li>
    //       </ul>
    //     </div>
    //   <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
    //     <button
    //       type="button"
    //       className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
    //       onClick={() => {
    //         if (team?.id) {
    //           post(route("admin.team.update", team.id));
    //         } else {
    //           post(route("admin.team.create"));
    //         }
    //       }}
    //     >
    //       {t('common:save')}
    //     </button>
    //     <button
    //       type="button"
    //       className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
    //       onClick={() => Inertia.get(route("admin.teams"))}
    //     >
    //       {t('common:cancel')}
    //     </button>
    //     </div>
    //   </div>
    // </main>
  );
}
