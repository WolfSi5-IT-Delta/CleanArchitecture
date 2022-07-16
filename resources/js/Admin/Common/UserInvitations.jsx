import React, {useState, useEffect, useContext, useCallback} from "react";
import { Link } from '@inertiajs/inertia-react'
import { Inertia } from "@inertiajs/inertia";
import Table from "../../Components/Table/Table.jsx";
import ActionsCell from "../../Components/Table/Cell/ActionsCell.jsx";
import NameCell from "../../Components/Table/Cell/NameCell.jsx";
import OneLineCell from "../../Components/Table/Cell/OneLineCell";
import Header from "../../Components/Header.jsx";
import axios from "axios";
import BooleanCell from "../../Components/Table/Cell/BooleanCell";
import {useTranslation} from "react-i18next";
import DateCell from "../../Components/Table/Cell/DateCell";
import UserCell from "../../Components/Table/Cell/UserCell";

export default function ({ paginatedList }) {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedList.last_page);

  const { t } = useTranslation(['common', 'table']);

  const users = paginatedList.data;
  const columns = [
    {
      Header: "#",
      accessor: "id",
      Filter: "",
      width: 50,
    },
    {
      Header: t('common:email'),
      accessor: "email",
      Filter: "",
      width: 200,
      Cell: OneLineCell,
    },
    {
      Header: 'Accepted',
      accessor: "accepted",
      Filter: "",
      width: 100,
      Cell: BooleanCell,
    },
    {
      Header: 'Sent',
      accessor: "created_at",
      Filter: "",
      width: 100,
      Cell: DateCell,
    },
    {
      Header: 'User',
      accessor: (row) => {
        const user = row.user;
        if (!user) return {};
        return {
          name: user.name + ' ' + (user.last_name ?? ''),
          image: user.avatar,
          disableEmptyImage: true
        };
      },
      width: 200,
      Filter: "",
      Cell: UserCell,
    },
    {
      Header: '',
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
            name: "Resend",
            type: "resend",
            action: () => { Inertia.get(route("admin.user.edit", item.id)) },
            disabled: item.accepted,
          },
          {
            name: "delete",
            type: "delete",
            action: () => {
              Inertia.post( route("admin.user.delete", item.id)) },
            disabled: false,
          },
        ],
      };
    });
  };

  const [data, setData] = useState(addActions(users));

  useEffect(() => {
    setData(addActions(users));
  }, [paginatedList]);

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
      <Header title="User's invitations"/>
      <Table
        dataValue={data}
        columnsValue={columns}
        controlledPageCount={controlledPageCount}
        total={paginatedList.total}
        fetchData={fetchData}
        loading={loading}
        curPage={curPage}
        perPage={paginatedList.per_page}
      />
      </div>
    </main>
  );
}
