import React, { useState, useRef, useContext, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';
import { Switch } from '@headlessui/react';
import { AdminContext } from '../reducer.jsx';
import AsyncSelect from 'react-select'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Access from '../Access';

const SortableItem = SortableElement(({value}) => <li className="relative -mb-px block border p-4 border-grey">{value}</li>);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul className="list-reset flex flex-col sm:col-span-2 w-full">
      {items.map((value, index) => (
        <SortableItem key={`item-${value.lesson_id}`} index={value.order} value={value.name} />
      ))}
    </ul>
  );
});

const sortOrder = (a, b) => {
  if (a.order < b.order) { return -1; }
  if (a.order > b.order) { return 1; }
  return 0;
};

export default function EditCourse({ course, all_lessons }) {
  const { state, dispatch } = useContext(AdminContext);

  const lessonsOrder = Object.values(course.lessons).map((item) => {
    return {
      course_id: item.pivot.course_id,
      lesson_id: item.pivot.lesson_id,
      name: item.name,
      order: item.pivot.order,
    }
  });

  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER', payload: course.id === undefined ? 'Создание курса' : `Редактирование курса`
    });
  }, []);
  const [courseImg, setCourseImg] = useState(course.image ?? '/img/noimage.jpg');
  const courseImgInput = useRef();
  const { data, setData, transform, post } = useForm({
    name: course.name ?? '',
    active: course.active ?? '',
    description: course.description ?? '',
    image: course.image ?? '',
    lessons: course.lessons === undefined ? [] : Object.values(course.lessons).map(item => item.id),
    options: course.options ?? null,
    users: null,
    order: lessonsOrder.sort(sortOrder) ?? null,
  });

  const [selectedUsers, setSelectedUsers] = useState([]);
  /**
  * I use this wrapper because setData isn't work properly like useState with Access component,
  * and I have no idea how to fix it
  */
  const setSelectedUsersWrapper = (callback) => {
    const callbackResult = callback(selectedUsers)
    setSelectedUsers(callbackResult);
    setData('users', JSON.stringify(callbackResult))
  };

  const handleInputChanges = (inputValue) => {
    console.log('inputVal', inputValue);
    const newVal = inputValue.find((item) => data.order.findIndex((oItem) => oItem.lesson_id === item.value) === -1);
    const newOrder = data?.order;
    if (newVal === undefined) {
      const oldVal = data?.order.findIndex((oItem) => inputValue.findIndex((item) => oItem.lesson_id === item.value) === -1);
      newOrder.splice(oldVal, 1);
      newOrder.forEach((item, idx) => {
        item.order = idx + 1;
      });
    } else {
      newOrder
      .push({
        course_id: course.id,
        lesson_id: newVal.value,
        name: newVal.label,
        order: data?.order.length >= 1 ? data?.order[data?.order.length - 1]?.order + 1 : 1,
      });
    }
    setData('order', newOrder);
    setData('lessons', inputValue.map(item => item.value));
  };

  const onSortEnd = ({oldIndex, newIndex}, e) => {
    console.log(oldIndex, newIndex, e.target);
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

  const onCourseImgChange = (e) => {
    setData('image', e.target.files[0]);
    const reader = new FileReader();
    reader.onload = function (ev) {
      setCourseImg(ev.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (<>
      <div className="bg-white shadow rounded-md">
        <div className="border-t border-gray-200">
          <ul>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Название курса</span>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
            </li>
            <li className="bg-white px-4 py-5 grid grid-cols-2 sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500 flex items-center sm:block">Статус</span>
              <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Switch
                    checked={Boolean(data.active)}
                    onChange={(e) => {setData('active', Number(e));}}
                    className={`
                    ${Boolean(data.active) ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    `}
                  >
                    <span className="sr-only">Course state</span>
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
              <span className="text-sm font-medium text-gray-500">Описание курса</span>
              <textarea
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
                defaultValue={data.description}
                onChange={(e) => setData('description', e.target.value)}
              />
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 ">
              <span className="text-sm font-medium text-gray-500">Изображение курса</span>
                <div className="flex flex-col w-3/4">
                  <div className="w-full mb-4 flex justify-center rounded-md overflow-hidden bg-gray-100 col-span-2">
                      <img className="max-h-[340px] w-full object-cover shadow-lg rounded-lg" src={courseImg} alt="course image"/>
                  </div>
                  <div className="relative">
                    <input
                      ref={courseImgInput}
                      type="file"
                      name="avatar"
                      id="avatar"
                      onChange={onCourseImgChange}
                    />
                  </div>
                </div>
            </li>
            <li className="bg-gray-50 px-4 py-5 sm:px-6">
              <span className="block text-sm font-medium text-gray-500 text-center">Параметры курса</span>
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Время между попытками</span>
              <input
                type="text"
                value={JSON.parse(data.options) !== null ? JSON.parse(data.options).delayTime : ''}
                onChange={(e) => {
                  let courseOptions = JSON.parse(data.options);
                  if (courseOptions !== null) { courseOptions.delayTime = e.target.value; } else { courseOptions = { delayTime: e.target.value }; }
                  setData('options', JSON.stringify(courseOptions));
                }}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
            </li>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500 flex items-center sm:block">Курс доступен для</span>
              <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Access
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsersWrapper}
                  visibleTypes={['U', 'DM']}
                  resource={`LC${course.id}`}
                />
              </span>
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500 flex items-center sm:block">Список Уроков:</span>
              <SortableList items={data.order} onSortEnd={onSortEnd} />
              <AsyncSelect 
                options={all_lessons}
                isMulti
                defaultValue={all_lessons.filter((item) => data.lessons.find((lessonId) => lessonId === item.value) )}
                onChange={handleInputChanges}
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
          onClick={() => {
            if (course.id !== undefined) { post(route('admin.course.edit', course.id), { data });
            } else {
              post(route('admin.course.create'), {
                data, onSuccess: (res) => {
                  dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                      position: 'bottom',
                      type: 'success',
                      header: 'Success!',
                      message: 'New course created!',
                    }
                  });
                  setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                }
              });
            }
          }}
        >
          Сохранить
        </button>
        {course.id !== undefined && <button
          type="button"
          className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
          onClick={() => Inertia.get(route('admin.lessons'))}
        >
          Показать уроки
        </button>}
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={() => Inertia.get(route('admin.courses'))}
        >
          Отмена
        </button>
      </div>
    </>);
};
