import React, { useState, useEffect, useContext } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Table from '../../Components/Table.jsx';
import OneLineCell from '../../Components/OneLineCell.jsx';
import ButtonCell from '../../Components/ButtonCell.jsx';

import { AdminContext } from '../reducer.jsx';

export default function TeacherLessons({ lessons }) {
  const { state: { navigation: nav }, dispatch } = useContext(AdminContext);

  const columns = [
    {
      Header: 'Name',
      accessor: 'user.name',
      Filter: '',
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: 'Course',
      accessor: 'course.name',
      Filter: '',
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: 'Lesson',
      accessor: 'lesson.name',
      Filter: '',
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: 'Date',
      accessor: 'created_at',
      Filter: '',
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: 'Answer',
      accessor: 'rowAction',
      Filter: '',
      width: 250,
      Cell: ButtonCell,
    },
  ];

  const addActions = (items) => {
    return items.map((item) => {
      return {
        ...item,
        rowAction: {
          onClick: () => {
            // Inertia.get(route('admin.respondent.answer', item.id));
          }
        }
      };
    });
  };

  // const [data, setData] = useState(addActions(respondents));

  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER', payload: 'Уроки на проверку'
    });
  }, []);

  let data = [];
  return (
    <main className="w-full h-fit">
      <Table
        dataValue={data}
        columnsValue={columns}
      />
    </main>
  );
}
