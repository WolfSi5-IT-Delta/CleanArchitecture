import React, { useState, useEffect, useContext } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Table from '../../Components/Table/Table.jsx';
import OneLineCell from '../../Components/Table/Cell/OneLineCell.jsx';
import ActionsCell from '../../Components/Table/Cell/ActionsCell.jsx';
// import { AdminContext } from '../reducer.jsx';
import Header from '../../Components/Header.jsx';
import StatusCell from "../../Components/Table/Cell/StatusCell";

export default function Answers({ answers, lid , qid}) {
  // const { state, dispatch } = useContext(AdminContext);

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      Filter: '',
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: 'Active',
      accessor: 'active',
      Filter: '',
      width: 70,
      Cell: StatusCell,
    },
    {
      Header: 'Sort',
      accessor: 'sort',
      Filter: '',
      width: 50,
      Cell: OneLineCell,
    },
    {
      Header: '',
      accessor: 'rowActions',
      disableFilters: true,
      Filter: '',
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
            name: 'edit',
            type: 'edit',
            action: () => {
              Inertia.get(route('admin.answer.edit', [lid, qid, item.id]));
            },
            disabled: false,
          },
          {
            name: 'delete',
            type: 'delete',
            action: () => {
              Inertia.post(route('admin.answer.delete', [lid, qid, item.id]));
            },
            disabled: false,
          },
        ]
      };
    });
  };

  const [data, setData] = useState(addActions(answers));

  useEffect(() => {
    setData(addActions(answers));
  }, [answers]);

  return (
    <main className="w-full h-fit">
    <Header title={'Ответы'}/>
      <Table
        dataValue={data}
        columnsValue={columns}
        options={{
          showPagination: false
        }}
      />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
            bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          Inertia.get(route('admin.answer.create', [lid, qid]));
        }}
      >Add Answer
      </button>
    </main>
  );
}
