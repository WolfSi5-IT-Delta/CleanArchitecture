import React, { useState, useCallback, useContext, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";
import Table from "../../Components/Table/Table.jsx";
import NameCell from "../../Components/Table/Cell/NameCell.jsx";
import TwoLineCell from "../../Components/Table/Cell/TwoLineCell.jsx";
import StatusCell from "../../Components/Table/Cell/StatusCell.jsx";
import ActionsCell from "../../Components/Table/Cell/ActionsCell.jsx";
import Select from "react-select";
import Header from "../../Components/Header.jsx";

export default function Courses({ paginatedCourses }) {
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedCourses.last_page);
  const courses = paginatedCourses.data;

  const columns = [
    {
      Header: "Курс",
      accessor: (row) => {
        return {
          name: row.name,
          image: row.image,
          signature: `course_group_id: ${row.course_group_id}`,
        };
      },
      id: "name",
      Filter: "",
      width: 250,
      Cell: NameCell,
    },
    {
      Header: "Описание",
      accessor: "description",
      disableFilters: true,
      Filter: "",
      width: 250,
      Cell: TwoLineCell,
    },
    {
      Header: "Статус",
      accessor: "active",
      Filter: "",
      width: 70,
      Cell: StatusCell,
    },
    {
      Header: "Действия",
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
  const [searchCourseId, setSearchCourseId] = useState(null);

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

  const handleCourseSearch = (inputValue) => {
    setSearchCourseId(inputValue === null ? null : inputValue.value);
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
    <main className="w-full h-fit">
        <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
        <Header title={'Курсы'}/>
      <div className="w-full pb-4 flex gap-10">
        <div className="w-80">
          Курс:
          <Select
            placeholder={"Select Course"}
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
        Add Course
      </button>
      </div>
    </main>
  );
}
