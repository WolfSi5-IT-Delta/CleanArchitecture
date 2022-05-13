import React, { useContext, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';
import { Switch } from '@headlessui/react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import AsyncSelect from 'react-select';
import { AdminContext } from '../reducer.jsx';
import Header from '../../Components/Header.jsx';

const SortableItem = SortableElement(({value}) => <li className="relative -mb-px block border p-4 border-grey">{value}</li>);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul className="list-reset flex flex-col sm:col-span-2 w-full">
      {items?.map((value, index) => (
        <SortableItem key={`item-${value.id}`} index={value.order} value={value.name} />
      ))}
    </ul>
  );
});

const sortOrder = (a, b) => {
  if (a.order < b.order) { return -1; }
  if (a.order > b.order) { return 1; }
  return 0;
};

export default function EditLesson({ lesson, all_questions }) {
  const { state: { navigation: nav }, dispatch } = useContext(AdminContext);

  const questionOrder = lesson?.questions?.map((item) => {
    return {
      id: item.id,
      lesson_id: item.lesson_id,
      name: item.name,
      order: item.sort,
    }
  });

  // useEffect(() => {
  //   dispatch({
  //     type: 'CHANGE_HEADER', payload: lesson.id === undefined ? 'Создание урока' : `Редактирование урока`
  //   });
  // }, []);

  const { data, setData, post } = useForm({
    name: lesson.name ?? '',
    active: lesson.active ?? '',
    questions: lesson.questions === undefined ? [] : Object.values(lesson.questions).map(item => item.id),
    description: lesson.description ?? '',
    detail_text: lesson.detail_text ?? '',
    order: questionOrder === undefined ? null : questionOrder.sort(sortOrder),
  });

  const handleInputChanges = (inputValue) => {
    const newVal = inputValue.find((item) => data.order.findIndex((oItem) => oItem.id === item.value) === -1);
    const newOrder = data.order;
    if (newVal === undefined) {
      const oldVal = data.order.findIndex((oItem) => inputValue.findIndex((item) => oItem.id === item.value) === -1);
      newOrder.splice(oldVal, 1);
      newOrder.forEach((item, idx) => {
        item.order = idx + 1;
      });
    } else {
      newOrder
      .push({
        id: newVal.value,
        lesson_id: lesson.id,
        name: newVal.label,
        order: data.order[data.order.length - 1].order + 1,
      });
    }
    setData('order', newOrder);
    setData('questions', inputValue.map(item => item.value));
  };

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
      newOrder.sort(sortOrder);
      setData('order', newOrder);
    }
  };

  return (
    <main>
      <div className="shadow bg-white rounded-xl border-t border-gray-200">
      <Header title={lesson.id === undefined
          ? "Создание нового урока"
          : `Редактирование урока`}/>
          <ul>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Название урока</span>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
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
              <span className="text-sm font-medium text-gray-500">Описание урока</span>
              <textarea
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                defaultValue={data.description}
                onChange={(e)=>setData('description',e.target.value)}
              />
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Изображение урока</span>
              <textarea
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                defaultValue={data.detail_text}
                onChange={(e)=>setData('detail_text',e.target.value)}
              />
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500 flex items-center sm:block">Список Вопросов:</span>
              <SortableList items={data.order} onSortEnd={onSortEnd} />
            </li>
          </ul>
      <div className="mt-8 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
          onClick={() => {
            if (lesson.id !== undefined) { post(route('admin.lesson.edit', lesson.id),
                { data });
            } else {
              post(route('admin.lesson.create'),
                {
                  data, onSuccess: () => {
                    dispatch(
                      {
                        type: 'SHOW_NOTIFICATION',
                        payload: {
                          position: 'bottom',
                          type: 'success',
                          header: 'Success!',
                          message: 'New lesson created!',
                        }
                      }
                    );
                    setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                  }
                });
            }
          }}
        >
          Сохранить
        </button>
        {lesson.id !== undefined &&
          <button
            type="button"
            className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
            onClick={() => Inertia.get(route('admin.questions', [lesson.id]))}
          >
            Показать вопросы
          </button>
        }
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={() => {
            Inertia.get(route('admin.lessons'));
          }}
        >
          Отмена
        </button>
        </div>
      </div>
    </main>
  );
};
