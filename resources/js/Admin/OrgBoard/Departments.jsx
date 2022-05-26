import React, {useState, useEffect, useContext, useCallback} from 'react';
import { Inertia } from '@inertiajs/inertia';
import Table from '../../Components/Table.jsx';
import ActionsCell from '../../Components/ActionsCell.jsx';
import { AdminContext } from '../reducer.jsx';
import OneLineCell from '../../Components/OneLineCell';
import Header from '../../Components/Header.jsx';
import axios from "axios";

export default function Departments({ paginatedList }) {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedList.last_page);

  const departments = paginatedList.data;

  const columns =  [
    {
      Header: '#',
      accessor: 'id',
      Filter: '',
    },
    {
      Header: 'Name',
      accessor: 'name',
      Filter: '',
      Cell: OneLineCell,
    },
    {
      Header: 'Head',
      accessor: 'head_name',
      Filter: '',
      Cell: OneLineCell,
    },
    {
      Header: 'Parent',
      accessor: 'parent_name',
      Filter: '',
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
    return  items.map((item, i) => {
      return {
        ...item,
        rowActions: [
          {
            name: 'edit',
            type: 'edit',
            action: () => {
              Inertia.get(route('admin.department.edit',  item.id));
            },
            disabled: false,
          },
          {
            name: 'delete',
            type: 'delete',
            action: () => {
              Inertia.post(route('admin.department.delete',  item.id), {});
            },
            disabled: false,
          },
        ]
      }
    })
  };

  const [data, setData] = useState(addActions(departments));

  useEffect(() => {
    setData(addActions(departments));
  }, [paginatedList]);

  const fetchData = useCallback(({ pageIndex, pageSize }) => {
    setLoading(true);

    axios
      .get(`${route(route().current())}?page=${pageIndex}&perpage=${pageSize}`)
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
      <Header title={'Департаменты'}/>
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
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
              bg-indigo-500 hover:bg-indigo-700"
          onClick={() => {
            Inertia.get(route('admin.department.create'));
          }}
        >Add Department
        </button>
        </div>
      </main>
  );
}
