import React, { useEffect, useContext } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { Switch } from '@headlessui/react';
import AsyncSelect from 'react-select'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { XIcon } from '@heroicons/react/outline';
import Access from '../../Components/Access';
import Header from "../../Components/AdminPages/Header.jsx";
import PermissionList from '../../Components/PermissionList.jsx';
import SortableList from '../../Components/SortableList';
import {useTranslation} from "react-i18next";
import Page, { ActionButton, ButtonsRow, CancelButton } from '../../Components/AdminPages/Page';
import { OptionsList,
  OptionItem,
  OptionItemName,
  OptionItemInputField,
  OptionItemInputNumberField,
  OptionItemErrorText,
  OptionItemSwitchField,
  OptionItemTextAreaField,
  OptionItemAccessField
} from '../../Components/AdminPages/OptionsList';

const sortByOrder = (a, b) => {
  return a.order - b.order;
};

export default function EditCurriculum({ curriculum, all_courses, permissions, permissionHistory }) {

  const { t } = useTranslation(['common', 'lc']);

  const courses = curriculum?.courses ?? [];
  const courseOrder = Object.values(courses).map((item) => {
      return {
        course_id: item.pivot.course_id ?? null,
        curriculum_id: item.pivot.curriculum_id ?? null,
        active: item.active,
        name: item.name,
        order: item.pivot.order,
      }
    })

  const { data, setData, post, errors } = useForm({
    name: curriculum?.name ?? '',
    active: curriculum?.active ?? true,
    description: curriculum?.description ?? '',
    courses: courses.map(item => item.id),
    order: courseOrder?.sort(sortByOrder) ?? [],
    sort: curriculum?.sort ?? 100,
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
      newOrder?.sort(sortByOrder);
      setData('order', newOrder);
    }
  };

  const editCourse = (value) => {
    Inertia.get(route(`admin.course.edit`, {
      id: value.course_id,
      backUrl: location.href,
    }));
  }

  const handleInputChanges = (inputValue) => {
    const newOrder = data?.order ?? [];
    newOrder.push({
      course_id: inputValue.value,
      curriculum_id: curriculum?.id ?? null,
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
    const newVal = data.courses ?? [];
    newVal.push(inputValue.value);
    setData("courses", newVal);
  };

  const handleRemoveCourse = (courseName) => {
    const newOrder = data.order;
    const newCourses = data.courses;
    const delOrderIdx = newOrder.findIndex((item) => item.name === courseName.name);
    const deleted = newOrder.splice(delOrderIdx, 1);
    const delCourseIdx = newCourses.findIndex((item) => item === deleted[0].lesson_id);
    newCourses.splice(delCourseIdx, 1);
    newOrder.sort(sortByOrder);
    setData('order', newOrder);
    setData('courses', newCourses);

  };

  const setPermission = (items) => {
    setData('permissions', items);
  }
  const removePermission = (item) => {
    setData('permissions', data.permissions.filter(e => (e.id !== item.id || e.type !== item.type)));
  }

  return(
    <Page>
      <Header title={curriculum?.id === undefined
        ? t('lc:createCurriculum')
        : t('lc:editCurriculum')}/>

      <OptionsList>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('common:name')}</OptionItemName>
          <OptionItemInputField
            value={data.name}
            onChange={(e) => setData('name', e)}
          />
          <OptionItemErrorText errorText={errors.name} />
        </OptionItem>

        <OptionItem className={"bg-white"}>
          <OptionItemName>{t('common:status')}</OptionItemName>
          <OptionItemSwitchField
            value={data.active}
            onChange={(e) => {setData('active', Number(e));}}
          />
        </OptionItem>

        <OptionItem className="bg-gray-50">
          <OptionItemName>{t('lc:sorting')}</OptionItemName>
          <OptionItemInputNumberField
            value={data.sort}
            onChange={(e) => setData('sort', e)}
          />
        </OptionItem>

        <OptionItem className="bg-white">
          <OptionItemName>{t('common:description')}</OptionItemName>
          <OptionItemTextAreaField
            value={data.description}
            onChange={(e) => setData('description', e)}
          />
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
          <OptionItemName>{t('lc:listOfCurriculums')}</OptionItemName>
          <span className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <SortableList
                items={data.order}
                onEdit={editCourse}
                onDelete={handleRemoveCourse}
                onSortEnd={onSortEnd}
                showStatus={true}
                lockAxis="y"
                distance={10}
                />

                <AsyncSelect
                  className='mt-4 w-4/5'
                  options={
                    all_courses?.filter((item) => {
                      const index = data.courses.findIndex((courseId) => courseId === item.value);
                      return index === -1;
                    })
                  }
                  value={''}
                  onChange={handleInputChanges}
                  placeholder={t('common:add')}
                />
            </span>
        </OptionItem>

      </OptionsList>

      <ButtonsRow>
        <CancelButton className='sm:col-start-1' label={t('common:cancel')} onClick={() => Inertia.get(route('admin.curriculums'))}/>
        <ActionButton
          className='sm:col-start-3'
          label={t('common:save')}
          onClick={() => {
            if (curriculum?.id) {
              post(route('admin.curriculum.edit', curriculum.id));
            } else {
              post(route('admin.curriculum.create'));
            }
          }}
        />
      </ButtonsRow>

    </Page>
  )
}
