import React, { useState, useEffect, useContext } from "react";
import { Inertia } from "@inertiajs/inertia";
import Table from "../../Components/Table.jsx";
import ActionsCell from "../../Components/ActionsCell.jsx";
import NameCell from "../../Components/NameCell.jsx";
import { AdminContext } from "../reducer.jsx";
import OneLineCell from "../../Components/OneLineCell";

export default function Users({ users }) {
  const {
    state: { navigation: nav },
    dispatch,
  } = useContext(AdminContext);

  const columns = [
    {
      Header: "ID",
      accessor: "id",
      Filter: "",
      width: 50,
    },
    {
      Header: "Name",
      accessor: (row) => {
        return {
          name: row.name,
          last_name: row.last_name,
          image: row.avatar,
        };
      },
      width: 200,
      Filter: "",
      Cell: NameCell,
    },
    {
      Header: "email",
      accessor: "email",
      Filter: "",
      width: 200,
      Cell: OneLineCell,
    },
    {
      Header: "phone",
      accessor: "phone",
      Filter: "",
      width: 200,
      Cell: OneLineCell,
    },
    {
      Header: "ACTIONS",
      accessor: "rowActions",
      disableFilters: true,
      Filter: "",
      width: 200,
      Cell: ActionsCell,
    },
  ];
  const addActions = (items) => {
    return items.map((item, i) => {
      return {
        ...item,
        rowActions: [
          {
            name: "edit",
            type: "edit",
            action: () => {
              Inertia.get(route("admin.user.edit", item.id));
            },
            disabled: false,
          },
          {
            name: "delete",
            type: "delete",
            action: () => {
              Inertia.post(
                route("admin.user.delete", item.id),
                {},
                {
                  onSuccess: () => {
                    dispatch({
                      type: "SHOW_NOTIFICATION",
                      payload: {
                        position: "bottom",
                        type: "success",
                        header: "Success!",
                        message: "Users deleted!",
                      },
                    });
                    setTimeout(
                      () => dispatch({ type: "HIDE_NOTIFICATION" }),
                      3000
                    );
                    Inertia.get(route("admin.users", item.id));
                  },
                }
              );
            },
            disabled: false,
          },
        ],
      };
    });
  };

  const [data, setData] = useState(addActions(users.data));

  useEffect(() => {
    setData(addActions(users.data));
  }, [nav]);

  useEffect(() => {
    dispatch({
      type: "CHANGE_HEADER",
      payload: "Пользователи",
    });
  }, []);

  return (
    <main>
      <Table dataValue={data} columnsValue={columns} />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
              bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          Inertia.get(route("admin.user.create"));
        }}
      >
        Add User
      </button>
    </main>
  );
}
