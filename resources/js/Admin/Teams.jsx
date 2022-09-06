import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Table from '../Components/Table.jsx';
import ActionsCell from '../Components/ActionsCell.jsx';
import { AdminContext } from './reducer.jsx';
import OneLineCell from '../Components/OneLineCell';
import axios from 'axios';

export default function Teams({ teams }) {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(teams.last_page);
  const team = teams.data;
  const { state: {
            navigation: nav
          },
          dispatch
        } = useContext(AdminContext);

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
      width: 100,
    },
    {
      Header: 'Descr',
      accessor: 'description',
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

const loc = route().current()

  const addActions = (items) => {

    return  items.map((item, i) => {
      return {
        ...item,
        rowActions: [
          {
            name: 'edit',
            type: 'edit',
            action: () => {
              Inertia.get(route('admin.team.edit',  item.id));
            },
            disabled: false,
          },
          {
            name: 'delete',
            type: 'delete',
            action: () => {
              Inertia.post(route('admin.team.delete',  item.id), {}, {
                onSuccess: () => {
                  dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                      position: 'bottom',
                      type: 'success',
                      header: 'Success!',
                      message: 'Team deleted!',
                    }
                  });
                  setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                  Inertia.get(route('admin.teams',  item.id));
                }
              });
            },
            disabled: false,
          },
        ]
      }
    })
  };

  const [data, setData] = useState(addActions(team));
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
    setData(addActions(team));
  }, [nav]);

  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER',
      payload: 'Teams'
    });
  }, []);

  return (
      <main>
        <Table
          dataValue={data}
          columnsValue={columns}
        loc={loc}
        controlledPageCount={controlledPageCount}
        total={teams.total}
        fetchData={fetchData}
        loading={loading}
        curPage={curPage}
        />
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm bg-indigo-500 hover:bg-indigo-700"
          onClick={() => {
            Inertia.get(route('admin.team.create'));
          }}
        >
          Add Team
        </button>
      </main>
  );
}
