import React, { useState, useCallback, useContext, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";
import Table from "../../Components/Table/Table.jsx";
import NameCell from "../../Components/Table/Cell/NameCell.jsx";
import TwoLineCell from "../../Components/Table/Cell/TwoLineCell.jsx";
import StatusCell from "../../Components/Table/Cell/StatusCell.jsx";
import ActionsCell from "../../Components/Table/Cell/ActionsCell.jsx";
import Select from "react-select";
import { usePage } from "@inertiajs/inertia-react";
import { useTranslation } from "react-i18next";

import Page from "../../Components/AdminPages/Page.jsx";
import Header from "../../Components/AdminPages/Header.jsx";

export default function Courses({ paginatedCourses }) {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedCourses.last_page);
  const courses = paginatedCourses.data;
  const { translations, local } = usePage().props;

  const { t } = useTranslation(['lc', 'table']);

  const columns = [
    {
      Header: t('course'),
      accessor: (row) => {
        return {
          name: row.name,
          image: row.image,
          actionName: 'edit'
          // signature: `course_group_id: ${row.course_group_id}`,
        };
      },
      // id: "name",
      Filter: "",
      width: 250,
      Cell: NameCell,
    },
    {
      Header: t('table:description'),
      accessor: "description",
      disableFilters: true,
      Filter: "",
      width: 250,
      Cell: TwoLineCell,
    },
    {
      Header: t('table:status'),
      accessor: "active",
      Filter: "",
      width: 70,
      Cell: StatusCell,
    },
    {
      Header: '',
      accessor: "rowActions",
      disableFilters: true,
      Filter: "",
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
            name: "edit",
            type: "edit",
            action: () => {
              Inertia.get(route("admin.course.edit", item.id));
            },
            disabled: false,
          },
          {
            name: "delete",
            type: "delete",
            action: () => {
              Inertia.post(
                route("admin.course.delete", item.id));
            },
            disabled: false,
          },
        ],
      };
    });
  };

  const [data, setData] = useState(addActions(courses));

  useEffect(() => {
    setData(addActions(courses));
  }, [paginatedCourses]);

  const [searchCourseId, setSearchCourseId] = useState(null);
  const [searchCourseName, setSearchCourseName] = useState(null);

  const fetchData = useCallback(({ pageIndex, pageSize, filter, sort, sortBy }) => {
    setLoading(true);

    axios
      .get(`${route(route().current())}?page=${pageIndex}&perpage=${pageSize}&sort=${sort??''}&sortBy=${sortBy??''}&filter=${filter??''}`)
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

  const allCourses = courses.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const applyFilters = (courseItem) => {
    const course =
      searchCourseId !== null ? courseItem.id === searchCourseId : true;
    return course;
  };

  return (
    <Page>
      <Header title={t('courses')}/>
      <div className="w-full pb-4 flex gap-10">
        <div className="w-80">
          {t('course')}:
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
        total={paginatedCourses.total}
        fetchData={fetchData}
        loading={loading}
        filter={searchCourseName}
        curPage={curPage}
        perPage={paginatedCourses.per_page}
      />
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 mt-4 text-base font-medium text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm
            bg-indigo-500 hover:bg-indigo-700"
        onClick={() => {
          Inertia.get(route("admin.course.create"));
        }}
      >
        {t('addCourse')}
      </button>

    </Page>
  );
}
