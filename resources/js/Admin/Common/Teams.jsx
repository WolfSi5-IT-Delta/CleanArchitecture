import React, { useState, useEffect, useContext } from "react";
import { Inertia } from "@inertiajs/inertia";
import Table from "../../Components/Table.jsx";
import ActionsCell from "../../Components/ActionsCell.jsx";
import { AdminContext } from "../reducer.jsx";
import OneLineCell from "../../Components/OneLineCell";
import Header from "../../Components/Header.jsx";

export default function Teams({ teams }) {
  const {
    state: { navigation: nav },
    dispatch,
  } = useContext(AdminContext);

  const columns = [
    {
      Header: "#",
      accessor: "id",
      Filter: "",
    },
    {
      Header: "Name",
      accessor: "name",
      Filter: "",
      Cell: OneLineCell,
      width: 100,
    },
    {
      Header: "Descr",
      accessor: "description",
      Filter: "",
      Cell: OneLineCell,
    },
    {
      Header: "",
      accessor: "rowActions",
      disableFilters: true,
      Filter: "",
      width: 100,
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
              Inertia.get(route("admin.team.edit", item.id));
            },
            disabled: false,
          },
          {
            name: "delete",
            type: "delete",
            action: () => {
              Inertia.post(
                route("admin.team.delete", item.id),
                {},
                {
                  onSuccess: () => {
                    Inertia.get(route("admin.teams", item.id));
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

  const [data, setData] = useState(addActions(teams.data));

  useEffect(() => {
    setData(addActions(teams.data));
  }, [nav]);

  return (
    <main>
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">        
    <Header title={'Команды'}/>
      <Table dataValue={data} columnsValue={columns} />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          Inertia.get(route("admin.team.create"));
        }}
      >
        Add Team
      </button>
      </div>
    </main>
  );
}
