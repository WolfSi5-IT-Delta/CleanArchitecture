import React, { useState, useEffect, useContext, useCallback } from "react";
import { Inertia } from "@inertiajs/inertia";
import Table from "../../Components/Table/Table.jsx";
import OneLineCell from "../../Components/Table/Cell/OneLineCell";
import ActionsCell from "../../Components/Table/Cell/ActionsCell.jsx";
import StatusCell from "../../Components/Table/Cell/StatusCell.jsx";
import axios from "axios";
import Select from "react-select";
import Header from "../../Components/AdminPages/Header.jsx";
import { useTranslation } from "react-i18next";
import NameCell from "../../Components/Table/Cell/NameCell";

export default function Lessons({ paginatedLessons }) {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedLessons.last_page);
  const lessons = paginatedLessons.data;

  const { t } = useTranslation(['lc', 'table']);

  const columns = [
    {
      Header: t('table:name'),
      accessor: (row) => {
        return {
          name: row.name,
          actionName: 'edit'
        };
      },

      Filter: "",
      width: 250,
      Cell: NameCell,
    },
    {
      Header: t('table:status'),
      accessor: "active",
      Filter: "",
      width: 70,
      Cell: StatusCell,
    },
    {
      Header: t('table:courses'),
      accessor: (row) => row.courses.map((item) => item.name).join(", "),
      Filter: "",
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: t('table:actions'),
      accessor: "rowActions",
      disableFilters: true,
      Filter: "",
      width: 50,
      Cell: ActionsCell,
    },
  ];

  const addActions = (items) => {
    return items.map((item, i) => {
      return {
        ...item,
        rowActions: [
          {
            name: "edit",
            type: "edit",
            action: () => {
              Inertia.get(route("admin.lesson.edit", item.id));
            },
            disabled: false,
          },
          {
            name: "delete",
            type: "delete",
            action: () => {
              Inertia.post(
                route("admin.lesson.delete", [item.id]));
            },
            disabled: false,
          },
        ],
      };
    });
  };

  const [data, setData] = useState(addActions(lessons));
  const [searchCourseId, setSearchCourseId] = useState(null);
  const [searchCourseName, setSearchCourseName] = useState(null);

  const fetchData = useCallback(({ pageIndex, pageSize, filter, sort, sortBy }) => {
    setLoading(true);
    axios
      .get(`${route(route().current())}?page=${pageIndex}&perpage=${pageSize}&filter=${filter??''}&sort=${sort??''}&sortby=${sortBy??''}`)
      .then((resp) => {
        setCurPage(Number(resp.data.current_page - 1));
        setControlledPageCount(resp.data.last_page);
        setData(addActions(resp.data.data));
      })
      .then(() => setLoading(false));
  }, []);

  const handleCourseSearch = (inputValue) => {
    setSearchCourseId(inputValue === null ? null : inputValue.value);
    setSearchCourseName(inputValue === null ? null : inputValue.label);
  };

  const allCourses = lessons.map((item) => {
    return {
      value: item.courses[0]?.id,
      label: item.courses[0]?.name,
    };
  });

  const applyFilters = (courseItem) => {
    // debugger;
    const course =
      searchCourseId !== null
        ? courseItem.courses[0].id === searchCourseId
        : true;
    return course;
  };

  useEffect(() => {
    setData(addActions(lessons));
  }, [lessons]);

  return (
    <main className="w-full h-fit">
        <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
      <Header title={t('lessons')}/>
      <div className="w-full pb-4 flex gap-10">
        <div className="w-80">
          {t('course')}
          <Select
            placeholder={t('selectCourse')}
            options={[
              ...new Map(
                allCourses.map((item) => [item["value"], item])
              ).values(),
            ]}
            isClearable
            onChange={handleCourseSearch}
          />
        </div>
      </div>
      <Table
        dataValue={data.filter(applyFilters)}
        columnsValue={columns}
        controlledPageCount={controlledPageCount}
        total={paginatedLessons.total}
        fetchData={fetchData}
        loading={loading}
        filter={searchCourseName}
        curPage={curPage}
        pageSizes={[3, 6, 9, 12]}
        perPage={paginatedLessons.per_page}
      />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
            bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          Inertia.get(route("admin.lesson.create"));
        }}
      >
        {t('addLesson')}
      </button>
      </div>
    </main>
  );
}
