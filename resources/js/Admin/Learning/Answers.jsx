import React, { useState, useEffect, useContext } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Table from '../../Components/Table.jsx';
import OneLineCell from '../../Components/OneLineCell.jsx';
import ActionsCell from '../../Components/ActionsCell.jsx';
import { AdminContext } from '../reducer.jsx';

export default function Answers({ answers }) {
  const { state: { navigation: nav }, dispatch } = useContext(AdminContext);
  const loc = route().current()
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
              Inertia.get(route('admin.answer.edit', [nav.currentLesson.id, nav.currentQuestion.id, item.id]));
            },
            disabled: false,
          },
          {
            name: 'delete',
            type: 'delete',
            action: () => {
              Inertia.post(route('admin.answer.delete', [nav.currentLesson.id, nav.currentQuestion.id, item.id]), {}, {
                onSuccess: () => {
                  dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                      position: 'bottom',
                      type: 'success',
                      header: 'Success!',
                      message: 'Answer deleted!',
                    }
                  });
                  setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                  Inertia.get(route('admin.answers', [nav.currentLesson.id, nav.currentQuestion.id]));
                }
              });
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
  }, [nav]);

  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER', payload: 'Ответы'
    });
  }, []);

  return (
    <main className="w-full h-fit">
      <Table
        dataValue={data}
        columnsValue={columns}
        loc={loc}
      />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
            bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          Inertia.get(route('admin.answer.create', [nav.currentLesson.id, nav.currentQuestion.id]));
        }}
      >Add Answer
      </button>
    </main>
  );
}
