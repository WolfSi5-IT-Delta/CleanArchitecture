import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import Table from '../../Components/Table.jsx';
import NameCell from '../../Components/NameCell.jsx';
import TwoLineCell from '../../Components/TwoLineCell.jsx';
import StatusCell from '../../Components/StatusCell.jsx';
import ActionsCell from '../../Components/ActionsCell.jsx';
import { AdminContext } from '../reducer.jsx';

export default function Courses({ paginatedCourses }) {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedCourses.last_page);
  const courses = paginatedCourses.data;
  const { state, dispatch } = useContext(AdminContext);
const loc = route().current()
  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER',
      payload: `Курсы`
    });
  }, []);

  const columns = [
    {
      Header: 'Курс',
      accessor: (row) => {
        return {
          name: row.name,
          image: row.image,
          signature: `course_group_id: ${row.course_group_id}`
        };
      },
      id: 'name',
      Filter: '',
      width: 250,
      Cell: NameCell,
    },
    {
      Header: 'Описание',
      accessor: 'description',
      disableFilters: true,
      Filter: '',
      width: 250,
      Cell: TwoLineCell,
    },
    {
      Header: 'Статус',
      accessor: 'active',
      Filter: '',
      width: 70,
      Cell: StatusCell,
    },
    {
      Header: 'Действия',
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
              Inertia.get(route('admin.course.edit', item.id));
            },
            disabled: false,
          },
          {
            name: 'delete',
            type: 'delete',
            action: () => {
              Inertia.post(route('admin.course.delete', item.id), {}, {
                onSuccess: () => {
                  dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                      position: 'bottom',
                      type: 'success',
                      header: 'Success!',
                      message: 'Course deleted!',
                    }
                  });
                  setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                  Inertia.get(route('admin.courses'));
                }
              });
            },
            disabled: false,
          },
        ]
      };
    });
  };
  const [data, setData] = useState(addActions(courses));

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
    <main className="w-full h-fit">
      <Table
        dataValue={data}
        columnsValue={columns}
        controlledPageCount={controlledPageCount}
        total={paginatedCourses.total}
        fetchData={fetchData}
        loading={loading}
        curPage={curPage}
        loc={loc}
      />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
            bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          Inertia.get(route('admin.course.create'));
        }}
      >Add Course
      </button>
    </main>
  );
}
