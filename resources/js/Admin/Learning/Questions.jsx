import React, { useState, useEffect, useContext } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Table from '../../Components/Table.jsx';
import OneLineCell from '../../Components/OneLineCell.jsx';
import StatusCell from '../../Components/StatusCell.jsx';
import ActionsCell from '../../Components/ActionsCell.jsx';
import { AdminContext } from '../reducer.jsx';
import Header from '../../Components/Header.jsx';

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

  // useEffect(() => {
  //   dispatch({
  //     type: 'CHANGE_HEADER', payload: 'Вопросы'
  //   });
  // }, []);

  return (
    <main className="w-full h-fit">
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">        
      <Header title={'Вопросы'}/>
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
          Inertia.get(route('admin.question.create', nav.currentLesson.id));
        }}
      >Add Question
      </button>
      </div>
    </main>
  );
}
