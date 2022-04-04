import React, { useState, useEffect, useContext } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Table from '../../Components/Table.jsx';
import OneLineCell from '../../Components/OneLineCell.jsx';
import StatusCell from '../../Components/StatusCell.jsx';
import ActionsCell from '../../Components/ActionsCell.jsx';
import { AdminContext } from '../reducer.jsx';

export default function Questions({ questions }) {
  const { state: { navigation: nav }, dispatch } = useContext(AdminContext);

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
              // console.log("-> item.lesson_id", item.lesson_id);
              Inertia.get(route('admin.question.edit', [item.lesson_id, item.id]));
            },
            disabled: false,
          },
          {
            name: 'delete',
            type: 'delete',
            action: () => {
              Inertia.post(route('admin.question.delete', [item.lesson_id, item.id]), {}, {
                onSuccess: () => {
                  dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                      position: 'bottom',
                      type: 'success',
                      header: 'Success!',
                      message: 'Question deleted!',
                    }
                  });
                  setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                  Inertia.get(route('admin.questions', item.lesson_id));
                }
              });
            },
            disabled: false,
          },
        ]
      };
    });
  };

  const [data, setData] = useState(addActions(questions));


  useEffect(() => {
    setData(addActions(questions));
  }, [nav]);

  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER', payload: 'Вопросы'
    });
  }, []);

  return (
    <main className="w-full h-fit">
      <Table
        dataValue={data}
        columnsValue={columns}
      />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
            bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          // FIXME we have to find a more civilized way to find the current lesson id
          Inertia.get(route('admin.question.create', questions[0].lesson_id));
        }}
      >Add Question
      </button>
    </main>
  );
}
