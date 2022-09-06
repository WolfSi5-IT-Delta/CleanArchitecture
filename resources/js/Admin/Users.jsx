import React, { useState, useEffect, useContext,useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Table from '../Components/Table.jsx';
import ActionsCell from '../Components/ActionsCell.jsx';
import NameCell from '../Components/NameCell.jsx';
import { AdminContext } from './reducer.jsx';
import OneLineCell from '../Components/OneLineCell';
import axios from 'axios';


export default function Users({ users }) {
const userData = users.data? users.data : [];
  const { state: {
    navigation: nav
  },
    dispatch
  } = useContext(AdminContext);
const [curPage, setCurPage] = useState(0);
const [loading, setLoading] = useState(false);
  const [controlledPageCount, setControlledPageCount] = useState(users.last_page);

const loc = route().current()

  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER', payload: 'Пользователи'
    });
  }, []);
  const columns =  [
    {
      Header: 'ID',
      accessor: 'id',
      Filter: '',
      width: 50,
    },
    {
      Header: 'Name',
      accessor: (row) => {
        return {
          name: row.name,
          last_name: row.last_name,
          image: row.avatar,
        }
      },
      Filter: '',
      Cell: NameCell,
    },
    {
      Header: 'email',
      accessor: 'email',
      Filter: '',
      Cell: OneLineCell,
    },
    {
      Header: 'phone',
      accessor: 'phone',
      Filter: '',
      Cell: OneLineCell,
    },
    {
      Header: 'ACTIONS',
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
              Inertia.get(route('admin.user.edit',  item.id));
            },
            disabled: false,
          },
          {
            name: 'delete',
            type: 'delete',
            action: () => {
              Inertia.post(route('admin.user.delete',  item.id), {}, {
                onSuccess: () => {
                  dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                      position: 'bottom',
                      type: 'success',
                      header: 'Success!',
                      message: 'Users deleted!',
                    }
                  });
                  setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                  Inertia.get(route('admin.users',  item.id));
                }
              });
            },
            disabled: false,
          },
        ]
      }
    })
  };

  const [data, setData] = useState(addActions(userData));

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

  useEffect(() => {
    setData(addActions(userData));
  }, [nav]);

  return (
      <main>
        <Table
          dataValue={data}
          columnsValue={columns}
          controlledPageCount={controlledPageCount}
          total={users.total}
          loading={loading}
          fetchData={fetchData}
          loc={loc}
          curPage={curPage}
        />
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
              bg-indigo-500 hover:bg-indigo-700"
          onClick={() => {
            Inertia.get(route('admin.user.create'));
          }}
        >Add User
        </button>
      </main>
  );
}
