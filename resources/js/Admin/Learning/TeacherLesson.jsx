import React, { useState, useRef, useContext, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';
import { AdminContext } from '../reducer.jsx';


export default function TeacherLesson({ answer }) {
  const { state, dispatch } = useContext(AdminContext);

  const { data, setData, post } = useForm({
    comment: answer.comment
  });

  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER', payload: 'Проверка урока'
    });
  }, []);

  console.log(data);

  return (
    <main>
      <div className="shadow rounded-md">
        <div className="border-t border-gray-200">
          <ul>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center rounded-t-md">
              <span className="text-sm font-medium text-gray-500">Студент</span>
              <span className="text-sm font-medium text-gray-500">{answer.user.name} {answer.user.last_name}</span>
            </li>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center rounded-t-md">
              <span className="text-sm font-medium text-gray-500">Курс</span>
              <span className="text-sm font-medium text-gray-500">{answer.course.name}</span>
            </li>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center rounded-t-md">
              <span className="text-sm font-medium text-gray-500">Урок</span>
              <span className="text-sm font-medium text-gray-500">{answer.lesson.name}</span>
            </li>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center rounded-t-md">
              <span className="text-sm font-medium text-gray-500">Ответ</span>
              <span className="text-sm font-medium text-gray-500">{answer.answers}</span>
            </li>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 align-items-center rounded-t-md">
              <span className="text-sm font-medium text-gray-500">Коментарий</span>
              <input
                type="text"
                value={data.comment}
                onChange={(e) => setData('comment', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
            </li>


            {/*<li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">*/}
            {/*  <span className="text-sm font-medium text-gray-500">Описание</span>*/}
            {/*  <textarea*/}
            {/*    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"*/}
            {/*    defaultValue={data.description}*/}
            {/*    onChange={(e) => setData('description', e.target.value)}*/}
            {/*  />*/}
            {/*</li>*/}
          </ul>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
          onClick={() => {
            post(route('admin.teacher.lesson', answer.id), {
              data, onSuccess: (res) => {
                dispatch({
                  type: 'SHOW_NOTIFICATION',
                  payload: {
                    position: 'bottom',
                    type: 'success',
                    header: 'Success!',
                    message: 'Student`s answer checked!',
                  }
                });
                setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
              }
            });
          }}
        >
          Сохранить
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={() => Inertia.get(route('admin.teacher.lessons'))}
        >
          Отмена
        </button>
      </div>
    </main>
  );
};
