import React, { useContext, useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { Switch } from '@headlessui/react';
import Header from '../../Components/Header.jsx';
import SortableList from '../../Components/SortableList.jsx';
import { PlusCircleIcon } from '@heroicons/react/outline';
import {useTranslation} from "react-i18next";

const sortByOrder = (a, b) => {
  return a.order - b.order;
};

export default function EditLesson({ lesson }) {

  let cnt = 1;
  let questionOrder = lesson?.questions?.map((item) => {
    return {
      id: item.id,
      active: item.active,
      lesson_id: item.lesson_id,
      name: item.name,
      order: item.sort,
    }
  }).sort(sortByOrder);
  questionOrder?.forEach(e => e.order = cnt++)

  const url = new URL(location);
  const backUrl = url?.searchParams.get('backUrl') ?? route('admin.lessons');

  const { t } = useTranslation(['common', 'lc']);

  const { data, setData, post, errors } = useForm({
    name: lesson.name ?? '',
    active: lesson.active ?? '',
    questions: lesson.questions === undefined ? [] : Object.values(lesson.questions).map(item => item.id),
    description: lesson.description ?? '',
    detail_text: lesson.detail_text ?? '',
    order: questionOrder,
    backUrl
  });

  const handleRemoveQuestion = (questionName) => {
    const newOrder = data.order;
    const newQuestions = data.questions;
    const delOrderIdx = newOrder.findIndex((item) => item.name === questionName.name);
    const deleted = newOrder.splice(delOrderIdx, 1);
    const delQuestionIdx = newQuestions.findIndex((item) => item === deleted[0].id);
    newQuestions.splice(delQuestionIdx, 1);
    newOrder.sort(sortByOrder);
    setData('order', newOrder);
    setData('questions', newQuestions);
    Inertia.post(route('admin.question.delete', [lesson.id, questionName.id]));


  }

  const onSortEnd = ({oldIndex, newIndex}) => {
    if(oldIndex !== newIndex) {
      const newOrder = data.order;
      const move = oldIndex < newIndex ? 'up' : 'down';
      newOrder.forEach(item => {
        if (move === 'up') {
          if (item.order === oldIndex) { item.order = newIndex; }
            else if (item.order > oldIndex && item.order <= newIndex) { item.order--; }
        } else {
          if (item.order === oldIndex) { item.order = newIndex; }
            else if (item.order >= newIndex && item.order < oldIndex) { item.order++; }
        }
      });
      newOrder.sort(sortByOrder);
      setData('order', newOrder);
    }
  };

  const editQuestion = (value) => {
    Inertia.get(route(`admin.question.edit`, {
      lid:value.lesson_id,
      qid: value.id,
      backUrl: location.href
    }));
  }

  return (
    <main>
      <div className="shadow bg-white rounded-xl border-t border-gray-200">
      <Header title={lesson.id === undefined
          ? t('lc:createLesson')
          : t('lc:editLesson')}/>
          <ul>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">{t('common:name')}</span>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
              {errors.name && <div className="text-sm font-medium text-red-500 text-red-600 col-end-3">{errors.name}</div>}
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Статус</span>
              <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Switch
                    checked={Boolean(data.active)}
                    onChange={(e) => {setData('active', Number(e));}}
                    className={`
                    ${Boolean(data.active) ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    `}
                  >
                    <span className="sr-only">Lesson state</span>
                    <span
                      className={`
                      ${Boolean(data.active) ? 'translate-x-5' : 'translate-x-0'}
                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                        `}
                    >
                      <span
                        className={`
                        ${Boolean(data.active) ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'}
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
                        className={`${Boolean(data.active) ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
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
            </li>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">{t('common:description')}</span>
              <textarea
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                defaultValue={data.description}
                onChange={(e)=>setData('description',e.target.value)}
              />
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">{t('lc:detailedText')}</span>
              <textarea
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                defaultValue={data.detail_text}
                onChange={(e)=>setData('detail_text',e.target.value)}
              />
            </li>

            {lesson.id !== undefined &&
              <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <span className="text-sm font-medium text-gray-500 flex items-center sm:block">{t('lc:listOfQuestions')}</span>
                <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <PlusCircleIcon
                    className="w-6 h-6 mb-1 text-blue-600 hover:text-blue-900 cursor-pointer"
                    onClick={() => Inertia.get(route('admin.question.create', lesson.id))}
                  />
                  <SortableList
                    items={data.order}
                    onEdit={editQuestion}
                    onDelete={handleRemoveQuestion}
                    onSortEnd={onSortEnd}
                    showStatus={true}
                    lockAxis="y"
                    distance={10}
                  />
                </span>
              </li>
            }

          </ul>
      <div className="mt-8 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
          onClick={() => {
            if (lesson.id) {
              post(route('admin.lesson.edit', lesson.id),{ data });
            } else {
              post(route('admin.lesson.create'), { data });
            }
          }}
        >
          {t('common:save')}
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={() => {
            Inertia.get(backUrl);
          }}
        >
          {t('common:cancel')}
        </button>
        </div>
      </div>
    </main>
  );
};
