import React, { useState, useRef, useContext, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import AsyncSelect from 'react-select'
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { PencilIcon, XIcon } from '@heroicons/react/outline';
import axios from 'axios';
import PermissionList from "../../Components/PermissionList";
import Header from '../../Components/AdminPages/Header.jsx';
import SortableList from '../../Components/SortableList.jsx';
import {AsyncPaginate} from "react-select-async-paginate";
import {useTranslation} from "react-i18next";
import Page, { ActionButton, Button, ButtonsRow, CancelButton } from '../../Components/AdminPages/Page';
import { OptionsList,
  OptionItem,
  OptionItemName,
  OptionItemInputField,
  OptionItemInputTimeField,
  OptionItemErrorText,
  OptionItemSwitchField,
  OptionItemTextAreaField,
  OptionItemAccessField
 } from '../../Components/AdminPages/OptionsList';


const sortByOrder = (a, b) => {
  return a.order - b.order;
};

export default function EditCourse({ course, all_lessons, permissions, permissionHistory }) {
  const { t } = useTranslation(['common', 'lc']);

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
    group: {
      value: course?.group?.id,
      label: course?.group?.name
    },
    image: course.image ?? null,
    lessons: course.lessons === undefined ? [] : Object.values(course.lessons).map(item => item.id),
    order: lessonsOrder?.sort(sortByOrder) ?? null,
    options: course.options ?? null,
    minutes: null,
    hours: null,
    permissions,
    backUrl
  });

  const loadGroups = async (search, loadedOptions, { page }) => {
    const sel = data.course?.id;
    let query = [
      search ? `search=${search}` : null,
      sel ? `selected=[${sel}]` : null,
      page !== 1 ? `page=${page}` : null
    ].filter(e => e).join('&');

    const url = route('admin.groups');
    const result = await axios.get(`${url}?${query}`);

    return {
      options: result.data.data.map(e => ( {
        value: e.id,
        label: e.name
      })),
      hasMore: result.data.next_page_url !== null,
      additional: {
        page: result.data.current_page + 1,
      },
    };
  };

  const removeCourseImage = () => {
    setCourseImg('/img/noimage.jpg')
    setData('image', null);
  }

  // Indicator for select cache cleaning
  const [updateIndicator, setUpdateIndicator] = useState(true);

  const handleSaveCourse = () => {
    // prepare for saving
    data.course_group_id = data?.group?.value ?? null;
    delete data.group;
    if (course.id) {
      post(route('admin.course.edit', course.id), { data });
    } else {
      post(route('admin.course.create'), { data });
    }
  }

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
    <Page>
      <Header title={course.id === undefined
      ? t('lc:createCourse')
      : t('lc:editCourse')}/>

      <OptionsList>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('common:name')}</OptionItemName>
          <OptionItemInputField
              value={data.name}
              onChange={(e) => setData('name', e)}
          />
          <OptionItemErrorText errorText={errors.name} />
        </OptionItem>

        <OptionItem className="bg-white">
          <OptionItemName>{t('common:status')}</OptionItemName>
          <OptionItemSwitchField
              value={data.active}
              onChange={(e) => setData('active', e)}
          />
        </OptionItem>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('common:description')}</OptionItemName>
          <OptionItemTextAreaField
              value={data.description}
              onChange={(e) => setData('description', e)}
          />
        </OptionItem>

        <OptionItem className="bg-white">
          <OptionItemName>{t('lc:group')}</OptionItemName>
            <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <AsyncPaginate
                className={"overflow-visible"}
                placeholder="Add"
                maxMenuHeight={150}
                menuPlacement="auto"
                defaultOptions
                loadOptions={loadGroups}
                additional={{ page: 1 }}
                value={data.group}
                onChange={(e) => {
                  setData("group", e);
                }}
                isClearable
              />
            </span>
        </OptionItem>

        <OptionItem className="bg-gray-50 sm:grid-cols-2">
          <OptionItemName>{t('common:image')}</OptionItemName>
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
        </OptionItem>

        <OptionItem className="bg-white off-grid">
          <OptionItemName className="block">{t('lc:timeBetweenAttempts')}</OptionItemName>
          <div className="flex">
                {/* bug */}
          <OptionItemInputTimeField
            className={'grid-rows-1'}
            text={'часов'}
            value={JSON.parse(data.hours) !== null ? JSON.parse(data.hours).delayTime : ''}
            onChange={(e) => {
            let courseHoursDelayTime = JSON.parse(data.hours);

              if (courseHoursDelayTime !== null) {
                courseHoursDelayTime.delayTime = e;
                } else {
                courseHoursDelayTime = { delayTime: e };
                }
              setData('hours', JSON.stringify(courseHoursDelayTime));
              }}
          />
          <OptionItemInputTimeField
            text={'минут'}
            value={JSON.parse(data.minutes) !== null ? JSON.parse(data.minutes).delayTime : ''}
            onChange={(e) => {
              let courseMinutesDelayTime = JSON.parse(data.minutes);
              if (courseMinutesDelayTime !== null) {
                courseMinutesDelayTime.delayTime = e;
              } else {
                courseMinutesDelayTime = { delayTime: e };
              }
              setData('minutes', JSON.stringify(courseMinutesDelayTime));
            }}
            />
          </div>

        </OptionItem>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('lc:availableFor')}</OptionItemName>
          <OptionItemAccessField
            permissions={data.permissions}
            setPermission={setPermission}
            visibleTypes={['U', 'D', 'T', 'O']}
            permissionHistory={permissionHistory}
          />
        </OptionItem>

        <OptionItem className="bg-white">
          <OptionItemName>{null}</OptionItemName>
          <PermissionList permissions={data.permissions} removePermission={removePermission} />
        </OptionItem>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('lc:listOfLessons')}</OptionItemName>
            <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <SortableList
                items={data.order}
                onEdit={editLesson}
                onDelete={handleRemoveLesson}
                onSortEnd={onSortEnd}
                showStatus={true}
                lockAxis="y"
                distance={10}
                />

                <AsyncSelect className='mt-4 w-4/5'
                options={
                  all_lessons?.filter((item) => !data.lessons.includes(item.value))
                }
                maxMenuHeight="180px"
                value={''}
                onChange={handleInputChanges}
                placeholder={t('common:add')}
              />
            </span>
        </OptionItem>

      </OptionsList>

      <ButtonsRow>
        <CancelButton className='sm:col-start-1' label={t('common:cancel')} onClick={() => Inertia.get(backUrl)}/>
        <ActionButton className='sm:col-start-3' label={t('common:save')} onClick={ handleSaveCourse }/>
      </ButtonsRow>

    </Page>
  );
};
