import React, {useContext} from 'react';
import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import {AdminContext} from '../reducer.jsx';
import {Switch} from "@headlessui/react";


export default function TeacherLesson({answer}) {
  const {state, dispatch} = useContext(AdminContext);

  const studentAnswers = Object.values(JSON.parse(answer.answers) ?? {});
  // const textAnswers = studentAnswers.filter(e => e.type == 'text');
  const obj = {};
  // console.log(JSON.parse(answer.answers));

  studentAnswers.forEach(e => {
      obj[e.question_id] = {
        question_id: e.question_id,
        question: e.question,
        answer: e.answer,
        type: e.type,
        hint: e.hint ?? '',
        comment: e.comment ?? '',
        done: e.done ?? 0
      }
    });

  const {data, setData, post} = useForm(obj);

  /*  useEffect(() => {
      dispatch({
        type: 'CHANGE_HEADER', payload: 'Проверка урока'
      });
    }, []);*/

  console.log(data);

  return (
    <main>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Проверка урока</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{answer.lesson.name}</p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Студент</dt>
              <dd
                className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{answer.user.name} {answer.user.last_name}</dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Курс</dt>
              <dd
                className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{answer.course.name}</dd>
            </div>
          </dl>
        </div>

        {/*<div className="border-t border-gray-200 px-4 py-5 sm:p-0">*/}
        {/*  <dl className="sm:divide-y sm:divide-gray-200">*/}
        {/*    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">*/}
        {/*      <dt className="text-sm font-medium text-gray-500">Урок</dt>*/}
        {/*      <dd*/}
        {/*        className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{answer.lesson.name}</dd>*/}
        {/*    </div>*/}
        {/*  </dl>*/}
        {/*</div>*/}

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Попытка</dt>
              <dd
                className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{answer.user.name} {answer.user.last_name}</dd>
            </div>
          </dl>
        </div>

        <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200 mx-3">

          {Object.values(data).filter(e => e.type == 'text').map(item => {
            // TODO: оформить
              return (
                <li key={item.question_id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"/>
                    </svg>
                    <span className="ml-2 flex-1 w-0 truncate">
                        {item.question}
                    </span>
                  </div>
                  <div><br />Answer: {item.answer}</div>
                  <div><br />Hint: {item.hint}</div>


                  <div className="w-full">
                    <span className="text-sm font-medium text-gray-500">Комментарий для ученика</span>
                    <textarea
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                      defaultValue={item.comment}
                      onChange={(e) => setData((d) => (
                            {
                              ...d,
                              [item.question_id]: {
                                ...item,
                                comment: e.target.value
                              }
                            }
                        )
                      )}
                    />
                  </div>

                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Зачет</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 block">
                  <Switch
                    checked={Boolean(item.done)}
                    onChange={(e) => setData((d) => (
                        {
                          ...d,
                          [item.question_id]: {
                            ...item,
                            done: Number(e)
                          }
                        }
                      )
                    )}
                    className={`
                    ${Boolean(item.done) ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    `}
                  >
                    <span className="sr-only">Зачёт</span>
                    <span className={`
                      ${Boolean(data.done) ? 'translate-x-5' : 'translate-x-0'}
                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                        `}
                    >
                      <span
                        className={`
                        ${Boolean(item.done) ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'}
                        absolute inset-0 h-full w-full flex items-center justify-center transition-opacity
                        `}
                        aria-hidden="true"
                      >
                        <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                          <path
                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span
                        className={`${Boolean(item.done) ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                        aria-hidden="true"
                      >
                        <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                          <path
                            d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"/>
                        </svg>
                      </span>
                    </span>
                  </Switch>
                </span>
                        </dd>
                      </div>
                    </dl>
                  </div>

                </li>
              );
            }
          )}

        </ul>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ОТВЕТ</dt>
              <dd
                className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{answer.answers} </dd>
            </div>
          </dl>
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
                setTimeout(() => dispatch({type: 'HIDE_NOTIFICATION'}), 3000);
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
