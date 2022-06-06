import React, { useState, useRef, useContext, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { Switch } from '@headlessui/react';
import AsyncSelect from 'react-select'
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { PencilIcon, XIcon } from '@heroicons/react/outline';
import Access from '../../Components/Access';
import axios from 'axios';
import {gridFilterModelSelector} from "@mui/x-data-grid";
import PermissionList from "../../Components/PermissionList";
import Header from '../../Components/Header.jsx';
import SortableList from '../../Components/SortableList.jsx';

const sortByOrder = (a, b) => {
  if (a.order < b.order) { return -1; }
  if (a.order > b.order) { return 1; }
  return 0;
};

export default function EditCourse({ course, all_lessons, permissions, permissionHistory }) {

  const lessons = course?.lessons ?? {};
  const lessonsOrder = Object.values(lessons).map((item) => {
      return {
        course_id: item.pivot.course_id ?? null,
        lesson_id: item.pivot.lesson_id ?? null,
        active: item.active,
        name: item.name,
        order: item.pivot.order,
      };
    });

  const [courseImg, setCourseImg] = useState(course.image ?? '/img/noimage.jpg');
  const courseImgInput = useRef();

  const url = new URL(location);
  const backUrl = url?.searchParams.get('backUrl') ?? route('admin.courses');

  const { data, setData, post, errors } = useForm({
    name: course.name ?? '',
    active: course.active ?? true,
    description: course.description ?? '',
    image: course.image ?? null,
    lessons: course.lessons === undefined ? [] : Object.values(course.lessons).map(item => item.id),
    order: lessonsOrder?.sort(sortByOrder) ?? null,
    options: course.options ?? null,
    permissions,
    backUrl
  });

  const removeCourseImage = () => {
    setCourseImg('/img/noimage.jpg')
    setData('image', null);
  }

  // Indicator for select cache cleaning
  const [updateIndicator, setUpdateIndicator] = useState(true);

  const handleInputChanges = (inputValue) => {
    const newOrder = data?.order ?? [];
    newOrder.push({
      course_id: course.id ?? null,
      lesson_id: inputValue.value,
      active: inputValue.active,
      name: inputValue.label,
      order:
        data.order !== null
          ? data?.order.length >= 1
            ? data?.order[data?.order.length - 1]?.order + 1
            : 1
          : 1,
    });
    setData("order", newOrder);
    const newVal = data.lessons ?? [];
    newVal.push(inputValue.value);
    setData("lessons", newVal);
    setUpdateIndicator((prev) => !prev);
  };

  const removePermission = (item) => {
    setData('permissions', data.permissions.filter(e => (e.id !== item.id || e.type !== item.type)));
  }
  const setPermission = (items) => {
    setData('permissions', items);
  }

  const handleRemoveLesson = (lessonName) => {
    const newOrder = data.order;
    const newLessons = data.lessons;
    const delOrderIdx = newOrder.findIndex((item) => item.name === lessonName.name);
    const deleted = newOrder.splice(delOrderIdx, 1);
    const delLessonIdx = newLessons.findIndex((item) => item === deleted[0].lesson_id);
    newLessons.splice(delLessonIdx, 1);
    newOrder.sort(sortByOrder);
    setData('order', newOrder);
    setData('lessons', newLessons);
    setUpdateIndicator((prev) => !prev);
  };

  const onSortEnd = ({ oldIndex, newIndex }, e) => {
    if (oldIndex !== newIndex) {
      const newOrder = data.order;
      const move = oldIndex < newIndex ? 'up' : 'down';
      newOrder.forEach(item => {
        if (move === 'up') {
          if (item.order === oldIndex) { item.order = newIndex; } else if (item.order > oldIndex && item.order <= newIndex) { item.order--; }
        } else {
          if (item.order === oldIndex) { item.order = newIndex; } else if (item.order >= newIndex && item.order < oldIndex) { item.order++; }
        }
      });
      newOrder.sort(sortByOrder);
      setData('order', newOrder);
    }
  };

  const editLesson = (lesson) => {
    Inertia.get(route(`admin.lesson.edit`, {
      lid: lesson.lesson_id,
      backUrl: location.href,
    } ));
  }

  const onCourseImgChange = (e) => {
    setData('image', e.target.files[0]);
    const reader = new FileReader();
    reader.onload = function (ev) {
      setCourseImg(ev.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <main>
      <div className="shadow bg-white rounded-xl border-t border-gray-200">
      <Header title={course.id === undefined
      ? "Создание курса"
      : `Редактирование курса`}/>
          <ul>
            <li className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-t-md">
              <span className="text-sm font-medium text-gray-500">Название курса</span>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 border-gray-300 rounded-md"
              />
              {errors.name && <div className="text-sm font-medium text-red-500 text-red-600 col-end-3">{errors.name}</div>}
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
                <div className="w-full mb-4 flex justify-center rounded-md overflow-hidden bg-white col-span-2">
                <div className="w-full">
                  <img className="max-h-[340px] w-full object-cover shadow-lg rounded-lg" src={courseImg ?? '/img/noimage.jpg'} alt="course image"/>
                </div>
                  <span className="bg-white">
                    <XIcon
                      className="w-5 h-5 mx-1 text-red-600 hover:text-red-900 cursor-pointer"
                      onClick={() => removeCourseImage()}
                    />
                  </span>
                </div>
                <div className="relative">
                  <input
                    ref={courseImgInput}
                    accept="image/*"
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
                  permissions={data.permissions}
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
            <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">

              <span className="text-sm font-medium text-gray-500 flex items-center sm:block">Список Уроков:</span>
              <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <SortableList
                  items={data.order}
                  onEdit={editLesson}
                  onDelete={handleRemoveLesson}
                  onSortEnd={onSortEnd}
                  status={true}
                  lockAxis="y"
                  distance={10}
                  />
                  <AsyncSelect
                  className='mt-4 w-4/5'
                  options={
                    all_lessons?.filter((item) => !data.lessons.includes(item.value))
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
            if (course.id) {
              post(route('admin.course.edit', course.id), { data });
            } else {
              post(route('admin.course.create'), { data });
            }
          }}
        >
          Сохранить
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={() => Inertia.get(backUrl)}
        >
          Отмена
        </button>
        </div>
      </div>
    </main>
  );
};
