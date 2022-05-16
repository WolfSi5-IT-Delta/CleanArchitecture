import React, { useEffect, useContext } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';
import { Switch } from '@headlessui/react';
import AsyncSelect from 'react-select'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { AdminContext } from '../reducer.jsx';
import { XIcon } from '@heroicons/react/outline';
import Access from '../../Components/Access';
import Header from '../../Components/Header.jsx';
import PermissionList from '../../Components/PermissionList.jsx';

const sortOrder = (a, b) => {
  if (a.order < b.order) { return -1; }
  if (a.order > b.order) { return 1; }
  return 0;
};

export default function EditCurriculum({ curriculum, all_courses, permissions, permissionHistory }) {
  const { state, dispatch } = useContext(AdminContext);

  const courseOrder = curriculum.courses?.length === 0
    ? null
    : curriculum?.courses?.map((item) => {
      return {
        course_id: item.pivot.course_id ?? null,
        curriculum_id: item.pivot.curriculum_id ?? null,
        name: item.name,
        order: item.pivot.order,
      }
  });
  console.log(curriculum)

  const { data, setData, post } = useForm({
    name: curriculum.name ?? '',
    active: curriculum.active ?? true,
    description: curriculum.description ?? '',
    courses: curriculum.courses === undefined ? [] : curriculum.courses.map(item => item.id),
    order: courseOrder?.sort(sortOrder) ?? [],
    sort: curriculum.sort ?? '',
    permissions
  });

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
      newOrder?.sort(sortOrder);
      setData('order', newOrder);
    }
  };

  const handleInputChanges = (inputValue) => {
    const newOrder = data?.order ?? [];
    newOrder.push({
      course_id: inputValue.value,
      curriculum_id: curriculum.id ?? null,
      name: inputValue.label,
      order: data.order !== null
        ? (data?.order.length >= 1 ? data?.order[data?.order.length - 1]?.order + 1 : 1)
        : 1,
    });
    setData('order', newOrder);
    const newVal = data.courses ?? [];
    newVal.push(inputValue.value);
    setData('courses', newVal);
  };

  const handleRemoveCourse = (courseName) => {
    const newOrder = data.order;
    const newCourses = data.courses;
    const delOrderIdx = newOrder.findIndex((item) => item.name === courseName);
    const deleted = newOrder.splice(delOrderIdx, 1);
    const delCourseIdx = newCourses.findIndex((item) => item === deleted[0].lesson_id);
    newCourses.splice(delCourseIdx, 1);
    newOrder.sort(sortOrder);
    setData('order', newOrder);
    setData('courses', newCourses);
  };

  const setPermission = (items) => {
    setData('permissions', items);
  }
  const removePermission = (item) => {
    setData('permissions', data.permissions.filter(e => (e.id !== item.id || e.type !== item.type)));
  }

  const SortableItem = SortableElement(({value}) => <li className="rounded-md w-4/5 relative -mb-px block border p-4 border-grey flex justify-between"><span>{value}</span><XIcon className="w-5 h-5 mx-1 text-red-600 hover:text-red-900 cursor-pointer" onClick={() => handleRemoveCourse(value)}/></li>);

  const SortableList = SortableContainer(({items}) => {
    return (
      <ul className="list-reset flex flex-col sm:col-span-2 w-full">
        {items?.map((value, index) => (
          <SortableItem key={`item-${value.course_id}`} index={value.order} value={value.name} />
        ))}
      </ul>
    );
  });
  console.log(data)

    return(
        <main>
          <div className="shadow bg-white rounded-xl border-t border-gray-200">
        <Header title={curriculum.id === undefined
          ? "Создание программы обучения"
          : `Редактирование программы обучения`}/>
          <ul>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Название Программы</span>
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
                    ${Boolean(data.active) ? 'bg-indigo-600' : 'bg-white'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
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
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <span className="text-sm font-medium text-gray-500 flex items-center sm:block">Сортировка</span>
            <input
                type="number"
                value={data.sort}
                onChange={(e) => setData('sort', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
              </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Описание программы</span>
              <textarea
                type="text"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500 flex items-center sm:block">Курс доступен для</span>
              <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Access
                  permissions={data.permissions}
                  // addPermission={addPermission}
                  // removePermission={removePermission}
                  setPermission={setPermission}
                  visibleTypes={['U', 'D', 'T', 'O']}
                  permissionHistory={permissionHistory}
                />
              </span>
            </li>
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-b-md">
            <div></div>
            <PermissionList permissions={data.permissions} removePermission={removePermission} />

            </li>

            <li className="bg-white px-4 py-5 grid grid-cols-2 sm:grid-cols-3 sm:gap-4 sm:px-6">
              <span className="text-sm font-medium text-gray-500">Список Курсов:</span>
              <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <SortableList items={data.order} onSortEnd={onSortEnd} lockAxis="y" distance={10} />
                <AsyncSelect
                  className='mt-4 w-4/5'
                  options={
                    all_courses
                      .filter((item) => {
                        const index = data.courses.findIndex((courseId) => courseId === item.value);
                        return index === -1;
                      })
                  }
                  value={''}
                  onChange={handleInputChanges}
                  placeholder="Add"
                />
              </span>
            </li>
            </ul>
          <div className="mt-8 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4 px-4">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
                onClick={() => {
                  if (curriculum.id !== undefined) {
                    post(route('admin.curriculum.edit', curriculum.id), { data });
                  } else {
                    post(route('admin.curriculum.create'), {
                      data, onSuccess: (res) => {
                        dispatch({
                          type: 'SHOW_NOTIFICATION',
                          payload: {
                            position: 'bottom',
                            type: 'success',
                            header: 'Success!',
                            message: 'New Curriculum created!',
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
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-white-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => Inertia.get(route('admin.curriculums'))}
              >
                Отмена
              </button>
            </div>
          </div>
        </main>
    )
}
