import React, { useEffect, useContext } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { AsyncPaginate } from "react-select-async-paginate";
import { AdminContext } from "../reducer.jsx";
import axios from "axios";

export default function EditTeam({ team }) {
  const { state, dispatch } = useContext(AdminContext);
  const { auth } = usePage().props;

  const mapUsers = (users) => {
    return (
      users?.map((e) => ({
        value: e.id,
        label: `${e.name} ${e.last_name}`.trim(),
      })) ?? []
    );
  };

  const users =
    team?.users?.map((e) => ({
      value: e.id,
      label: `${e.name} ${e.last_name}`.trim(),
    })) ?? [];

  const { data, setData, post } = useForm({
    name: team?.name ?? "",
    description: team?.description ?? "",
    users: mapUsers(team?.users),
  });

  // console.log("-> data", data);

  // useEffect(() => {
  //   dispatch({
  //     type: "CHANGE_HEADER",
  //     payload: team?.id ? "Редактирование команды" : "Создание команды",
  //   });
  // }, []);

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
    <main className="bg-white shadow rounded-md">
      <div className="shadow rounded-md">
        <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-medium text-gray-900">
            Редактирование команды
          </h2>
        </div>
          <ul>
            <li className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center rounded-t-md">
              <span className="text-sm font-medium text-gray-500">
                Название
              </span>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">
                Описание
              </span>
              <textarea
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                defaultValue={data.description}
                onChange={(e) => setData("description", e.target.value)}
              />
            </li>
            <li className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-b-md">
              <span className="text-sm font-medium text-gray-500 flex items-center sm:block">
                Пользователи:
              </span>
              <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <AsyncPaginate
                  classNames={"overflow-visible"}
                  isMulti
                  placeholder="Add"
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
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
          onClick={() => {
            if (team?.id) {
              post(route("admin.team.update", team.id), { data });
            } else {
              post(route("admin.team.create"), {
                data,
                onSuccess: (res) => {
                  dispatch({
                    type: "SHOW_NOTIFICATION",
                    payload: {
                      position: "bottom",
                      type: "success",
                      header: "Success!",
                      message: "New Team created!",
                    },
                  });
                  setTimeout(
                    () => dispatch({ type: "HIDE_NOTIFICATION" }),
                    3000
                  );
                },
              });
            }
          }}
        >
          Сохранить
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={() => Inertia.get(route("admin.teams"))}
        >
          Отмена
        </button>
      </div>
    </main>
  );
}
