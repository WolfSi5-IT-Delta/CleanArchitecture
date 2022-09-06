import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Table from '../../Components/Table.jsx';
import OneLineCell from '../../Components/OneLineCell.jsx';
import ActionsCell from '../../Components/ActionsCell.jsx';
import StatusCell from '../../Components/StatusCell.jsx';
import { AdminContext } from '../reducer.jsx';
import axios from 'axios';

export default function Lessons({ paginatedLessons }) {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedLessons.last_page);
  const lessons = paginatedLessons.data;
  const { state: { navigation: nav }, dispatch } = useContext(AdminContext);
  const loc = route().current()
  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER', payload: 'Уроки'
    });
  }, []);

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      Filter: '',
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: 'active',
      accessor: 'active',
      Filter: '',
      width: 70,
      Cell: StatusCell,
    },
    {
      Header: 'Courses',
      accessor: (row) => row.courses.map((item) => item.name).join(', '),
      Filter: '',
      width: 250,
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
    return items.map((item, i) => {
      return {
        ...item,
        rowActions: [
          {
            name: 'edit',
            type: 'edit',
            action: () => {
              Inertia.get(route('admin.lesson.edit', item.id));
            },
            disabled: false,
          },
          {
            name: 'delete',
            type: 'delete',
            action: () => {
              Inertia.post(route('admin.lesson.delete', [item.id]), {}, {
                onSuccess: () => {
                  dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                      position: 'bottom',
                      type: 'success',
                      header: 'Success!',
                      message: 'Lesson deleted!',
                    }
                  });
                  setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                  Inertia.get(route('admin.lessons'));
                }
              });
            },
            disabled: false,
          },
        ]
      };
    });
  };
  const [data, setData] = useState(addActions(lessons));

  const fetchData = useCallback(({ pageIndex, pageSize }) => {
    setLoading(true);
    axios
      .get(`${route(route().current())}?page=${pageIndex}&perpage=${pageSize}`)
      .then((resp) => {
        console.log(resp);
        setCurPage(Number(resp.data.current_page - 1));
        setControlledPageCount(resp.data.last_page);
        setData(addActions(resp.data.data));
      })
      .then(() => setLoading(false));
  }, []);
  useEffect(() => {
    setData(addActions(lessons));
  }, [nav]);

  return (
    <main className="w-full h-fit">
      <Table
        dataValue={data}
        columnsValue={columns}
        controlledPageCount={controlledPageCount}
        total={paginatedLessons.total}
        fetchData={fetchData}
        loc={loc}
        loading={loading}
        curPage={curPage}

      />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
            bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          Inertia.get(route('admin.lesson.create'));
        }}
      >Add Lesson
      </button>
    </main>
  );
}
