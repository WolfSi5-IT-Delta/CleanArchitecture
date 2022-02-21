import React, { useState, useCallback, useRef, useContext, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';
import axios from 'axios';
import { Switch } from '@headlessui/react';
import Table from '../Components/Table.jsx';
import OneLineCell from '../Components/OneLineCell.jsx';
import ActionsCell from '../Components/ActionsCell.jsx';
import { AdminContext } from './reducer.jsx';

export default function Courses({ paginatedCourses }) {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedCourses.last_page);
  const courses = paginatedCourses.data;
  const [editedCourse, setEditedCourse] = useState(null);
  const { state, dispatch } = useContext(AdminContext);

  useEffect(() => {
    dispatch({
      type: 'CHANGE_HEADER',
      payload: `Курсы`
    });
  }, []);


  const showCourseLessons = () => {
    dispatch(
      {
        type: 'CHOSE_COURSE',
        payload: {
          id: editedCourse.id,
          name: editedCourse.name
        }
      },
      {
        type: 'CHANGE_HEADER',
        payload: `Уроки курса ${editedCourse.name}`
      }
    );
    Inertia.post(route('admin.lessons', editedCourse.id));
  };

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
      Cell: OneLineCell,
    },
    {
      Header: 'Действия',
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
              setEditedCourse(item);
              dispatch({
                type: 'CHANGE_HEADER',
                payload: `Редактирование курса ${item.name}`
              });
            },
            disabled: false,
          },
          {
            name: 'delete',
            type: 'delete',
            action: () => {
              Inertia.post(route('admin.courses.delete', item.id), {}, {
                onSuccess: () => {
                  dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                      position: 'bottom',
                      type: 'success',
                      header: 'Success!',
                      message: 'Course deleted!',
                    }
                  });
                  setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                  Inertia.get(route('admin.courses'));
                }
              });
            },
            disabled: false,
          },
        ]
      };
    });
  };
  const [data, setData] = useState(addActions(courses));
  const tableOptions = {
    // showGlobalFilter: true,
    // showColumnSelection: false,
    showElementsPerPage: true,
    // showGoToPage: false,
    showPagination: true,
  };

  const fetchData = useCallback(({ pageIndex, pageSize }) => {
    setLoading(true);

    axios
      .get(`${route(route().current())}?page=${pageIndex}&perpage=${pageSize}`)
      .then((resp) => {
        setCurPage(Number(resp.data.current_page - 1));
        setControlledPageCount(resp.data.last_page);
        setData(addActions(resp.data.data));
      })
      .then(() => setLoading(false));
  }, []);

  const EditCourseForm = () => {
    const [courseImg, setCourseImg] = useState(editedCourse.image ?? '');
    const courseImgInput = useRef();
    const { data, setData, post } = useForm({
      name: editedCourse.name ?? '',
      active: editedCourse.active ?? '',
      description: editedCourse.description ?? '',
      image: editedCourse.image ?? '',
      options: editedCourse.options ?? null
    });

    const onCourseImgChange = (e) => {
      setData('image', e.target.files[0]);
      const reader = new FileReader();
      reader.onload = function (ev) {
        setCourseImg(ev.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    return (
      <>
        <div className="bg-white shadow overflow-hidden rounded-md">
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
                />
              </li>
              <li className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <span className="text-sm font-medium text-gray-500">Изображение курса</span>
                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="w-full mb-4 flex justify-center rounded-md overflow-hidden bg-gray-100 col-span-2">
                    <img src={courseImg} alt="course image"/>
                  </span>
                  <input
                    ref={courseImgInput}
                    type="file"
                    name="avatar"
                    id="avatar"
                    onChange={onCourseImgChange}
                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 col-span-10 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
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
            </ul>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-3 sm:text-sm"
            onClick={() => {
              if (typeof editedCourse.id !== 'undefined') {
                post(route('admin.courses.edit', editedCourse.id),
                  {
                    data, onSuccess: (res) => {
                      dispatch({
                        type: 'CHANGE_HEADER',
                        payload: `Курсы`
                      });
                    }
                  });
              } else {
                post(route('admin.courses.create'),
                  {
                    data, onSuccess: (res) => {
                      dispatch(
                        {
                          type: 'CHANGE_HEADER',
                          payload: `Курсы`
                        },
                        {
                          type: 'SHOW_NOTIFICATION',
                          payload: {
                            position: 'bottom',
                            type: 'success',
                            header: 'Success!',
                            message: 'New course created!',
                          }
                        }
                      );
                      setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
                    }
                  });
              }
              setEditedCourse(null);
            }}
          >
            Сохранить
          </button>
          {typeof editedCourse.id !== 'undefined' &&
            <button
              type="button"
              className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
              onClick={showCourseLessons}
            >
              Показать уроки
            </button>
          }
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            onClick={() => {
              setEditedCourse(null);
              dispatch({
                type: 'CHANGE_HEADER',
                payload: `Курсы`
              });
            }}
          >
            Отмена
          </button>
        </div>
      </>
    );
  };

  return (
    <main className="w-full h-fit">
      {editedCourse === null
        ? <>
          <Table
            dataValue={data}
            columnsValue={columns}
            options={tableOptions}
            controlledPageCount={controlledPageCount}
            total={paginatedCourses.total}
            fetchData={fetchData}
            loading={loading}
            curPage={curPage}
          />
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
            bg-indigo-500 hover:bg-indigo-700"
            onClick={() => {
              setEditedCourse(true);
              dispatch({
                type: 'CHANGE_HEADER',
                payload: `Добавление курса`
              });
            }}
          >Add Course
          </button>
        </>
        : <EditCourseForm/>
      }
    </main>
  );
}
