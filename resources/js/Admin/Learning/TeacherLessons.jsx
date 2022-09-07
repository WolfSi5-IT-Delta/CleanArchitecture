import React, {useState, useEffect, useContext, useCallback} from "react";
import { Inertia } from "@inertiajs/inertia";
import Table from "../../Components/Table/Table.jsx";
import OneLineCell from "../../Components/Table/Cell/OneLineCell.jsx";
import ActionsCell from "../../Components/Table/Cell/ActionsCell.jsx";
import Select from "react-select";
import Header from "../../Components/AdminPages/Header.jsx";
import axios from "axios";
import DateCell from "../../Components/Table/Cell/DateCell.jsx";
import {useTranslation} from "react-i18next";
import UserCell from "../../Components/Table/Cell/UserCell";

export default function TeacherLessons({ paginatedList }) {

  const { t } = useTranslation(['common', 'lc', 'table']);
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedList.last_page);
  const loc = window.location.pathname;
  const checkStorage = JSON.parse(localStorage.getItem(loc));
  const respondents =checkStorage? []:paginatedList.data;
  const columns = [
    {
      Header: t('table:name'),
      id: "user.name",
      accessor: (row) => {
        return {
          name: row.user.name + ' ' + (row.user.last_name ?? ''),
          actionName: 'Check',
          image: row.user.avatar,
        };
      },
      Filter: "",
      width: 250,
      Cell: UserCell,
    },
    {
      Header: t('lc:course'),
      accessor: "course.name",
      Filter: "",
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: t('lc:lesson'),
      accessor: "lesson.name",
      Filter: "",
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: t('table:date'),
      accessor: "created_at",
      Filter: "",
      width: 250,
      Cell: DateCell,
    },
    {
      Header: "",
      accessor: "rowActions",
      Filter: "",
      disableFilters: true,
      width: 250,
      Cell: ActionsCell,
    },
  ];

  const addActions = (items) => {
    return items.map((item) => {
      return {
        ...item,
        rowActions: [
          {
            name: 'Check',
            type: 'button',
            action: () => Inertia.get(route("admin.teacher.lesson", item.id)),
            disabled: false
          }
        ],
      };
    });
  };

  const [data, setData] = useState(addActions(respondents));
  const [searchUserId, setSearchUserId] = useState(null);
  const [searchCourseId, setSearchCourseId] = useState(null);
  const [searchLessonId, setSearchLessonId] = useState(null);

  const fetchData = useCallback(({ pageIndex, pageSize, sort, sortBy }) => {
    setLoading(true);

    axios
      .get(`${route(route().current())}?page=${pageIndex}&perpage=${pageSize}&sort=${sort??''}&sortby=${sortBy??''}`)
      .then((resp) => {
        setCurPage(Number(resp.data.current_page - 1));
        setControlledPageCount(resp.data.last_page);
        setData(addActions(resp.data.data));
      })
      .then(() => setLoading(false));
  }, []);

  const allUsers = respondents.map((item) => {
    return {
      value: item.user.id,
      label: `${item.user.name} ${item.user.last_name}`,
    };
  });

  const allCourses = respondents.map((item) => {
    return {
      value: item.course.id,
      label: item.course.name,
    };
  });

  const allLessons = respondents.map((item) => {
    return {
      value: item.lesson.id,
      label: item.lesson.name,
    };
  });
  const handleUserSearch = (inputValue) => {
    setSearchUserId(inputValue === null ? null : inputValue.value);
  };

  const handleCourseSearch = (inputValue) => {
    setSearchCourseId(inputValue === null ? null : inputValue.value);
  };

  const handleLessonSearch = (inputValue) => {
    setSearchLessonId(inputValue === null ? null : inputValue.value);
  };
  const applyFilters = (answer) => {
    const user = searchUserId !== null ? answer.user.id === searchUserId : true;
    const course =
      searchCourseId !== null ? answer.course.id === searchCourseId : true;
    const lesson =
      searchLessonId !== null ? answer.lesson.id === searchLessonId : true;
    return user && course && lesson;
  };

  return (
    <main className="w-full h-fit">
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
        <Header title={t('lc:studentsAnswers')}/>
        <div className="w-full pb-4 flex gap-10">
        <div className="w-80">
          {t('lc:student')}
          <Select
            placeholder={t('lc:selectStudent')}
            className="basic-single"
            classNamePrefix="select"
            options={[
              ...new Map(
                allUsers.map((item) => [item["value"], item])
              ).values(),
            ]}
            isClearable
            onChange={handleUserSearch}
          />
        </div>

        <div className="w-80">
          {t('lc:course')}
          <Select
            placeholder={t('lc:selectCourse')}
            options={[
              ...new Map(
                allCourses.map((item) => [item["value"], item])
              ).values(),
            ]}
            isClearable
            onChange={handleCourseSearch}
          />
        </div>

        <div className="w-80">
          {t('lc:lesson')}
          <Select
            placeholder={t('lc:selectLesson')}
            options={[
              ...new Map(
                allLessons.map((item) => [item["value"], item])
              ).values(),
            ]}
            isClearable
            onChange={handleLessonSearch}
          />
        </div>
      </div>

      <Table
        dataValue={data.filter(applyFilters)}
        columnsValue={columns}
        controlledPageCount={controlledPageCount}
        total={paginatedList.total}
        fetchData={fetchData}
        loading={loading}
        curPage={curPage}
        loc={loc}
        perPage={paginatedList.per_page}
      />
      </div>
    </main>
  );
}
