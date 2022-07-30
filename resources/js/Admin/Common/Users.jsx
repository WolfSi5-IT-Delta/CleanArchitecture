import React, {useState, useEffect, useContext, useCallback} from "react";
import { Link } from '@inertiajs/inertia-react'
import { Inertia } from "@inertiajs/inertia";
import Table from "../../Components/Table/Table.jsx";
import ActionsCell from "../../Components/Table/Cell/ActionsCell.jsx";
import UserCell from "../../Components/Table/Cell/UserCell.jsx";
import OneLineCell from "../../Components/Table/Cell/OneLineCell";
import Header from "../../Components/Header.jsx";
import axios from "axios";
import BooleanCell from "../../Components/Table/Cell/BooleanCell";
import { useTranslation } from "react-i18next";

export default function Users() {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState();

  const { t } = useTranslation(['common', 'table']);

  // const users = paginatedList.data;
  const columns = [
    {
      Header: "#",
      accessor: "id",
      Filter: "",
      width: 50,
    },
    {
      id: "name",
      Header: t('table:name'),
      accessor: (row) => {
        return {
          name: row.name + ' ' + (row.last_name ?? ''),
          image: row.avatar,
          actionName: 'edit'
        };
      },
      width: 200,
      Filter: "",
      Cell: UserCell,
    },
    {
      Header: t('common:email'),
      accessor: "email",
      Filter: "",
      width: 200,
      Cell: OneLineCell,
    },
    {
      Header: t('common:phone'),
      accessor: "phone",
      Filter: "",
      width: 200,
      Cell: OneLineCell,
    },
    {
      Header: t('table:admin'),
      accessor: "admin",
      Filter: "",
      width: 100,
      Cell: BooleanCell,
    },
    {
      Header: t('table:actions'),
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
            action: () => Inertia.get(route("admin.user.edit", item.id)),
            disabled: false,
          },
          {
            name: "delete",
            type: "delete",
            action: () => Inertia.post( route("admin.user.delete", item.id)),
            disabled: false,
          },
        ],
      };
    });
  };

  // const [data, setData] = useState(addActions(users));
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   setData(addActions(users));
  // }, [paginatedList]);

  const fetchData = useCallback(({ pageIndex, pageSize, sort, sortBy }) => {
    setLoading(true);
    axios
      .get(`${route(route().current())}?page=${pageIndex}&perpage=${pageSize}&sort=${sort??''}&sortBy=${sortBy??''}`)
      .then((resp) => {
        setCurPage(Number(resp.data.current_page - 1));
        setControlledPageCount(resp.data.last_page);
        setData(addActions(resp.data.data));
      })
      .then(() => setLoading(false));
  }, []);

  return (
    <main>
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
      <Header title={t('common:users')}/>
      <div className="pb-3 flex justify-end">
        <Link className='font-semibold text-indigo-600 hover:text-indigo-900' href={route("admin.user.invitations")}>Invitations</Link>
      </div>
      <Table
        dataValue={data}
        columnsValue={columns}
        controlledPageCount={controlledPageCount}
        fetchData={fetchData}
        loading={loading}
        curPage={curPage}
      />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
              bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          Inertia.get(route("admin.user.create"));
        }}
      >
        {t('common:addUser')}
      </button>
      </div>
    </main>
  );
}
