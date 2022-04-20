import React, { useState, useEffect, useContext } from "react";
import { Inertia } from "@inertiajs/inertia";
import Table from "../../Components/Table.jsx";
import OneLineCell from "../../Components/OneLineCell.jsx";
import ButtonCell from "../../Components/ButtonCell.jsx";
import Select from "react-select";

import { AdminContext } from "../reducer.jsx";

export default function TeacherLessons({ respondents }) {
  const {
    state: { navigation: nav },
    dispatch,
  } = useContext(AdminContext);

  const columns = [
    {
      Header: "Name",
      accessor: "user.name",
      Filter: "",
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: "Course",
      accessor: "course.name",
      Filter: "",
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: "Lesson",
      accessor: "lesson.name",
      Filter: "",
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: "Date",
      accessor: "created_at",
      Filter: "",
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: "",
      accessor: "rowAction",
      Filter: "",
      disableFilters: true,
      width: 250,
      Cell: ButtonCell,
    },
  ];

  const addActions = (items) => {
    return items.map((item) => {
      return {
        ...item,
        rowAction: {
          onClick: () => {
            Inertia.get(route("admin.teacher.lesson", item.id));
          },
        },
      };
    });
  };

  useEffect(() => {
    dispatch({
      type: "CHANGE_HEADER",
      payload: "Уроки на проверку",
    });
  }, []);

  const [data, setData] = useState(addActions(respondents));
  const [searchUserId, setSearchUserId] = useState(null);
  const [searchCourseId, setSearchCourseId] = useState(null);
  const [searchLessonId, setSearchLessonId] = useState(null);
  const allUsers = respondents.map((item) => {
    return {
      value: item.user.id,
      label: item.user.name,
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
      <div className="w-full pb-4 flex gap-10">
        <div className="w-80">
          Ученик:
          <Select
            placeholder="Select User"
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

        <div className="w-80">
          Урок:
          <Select
            placeholder={"Select Lesson"}
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

      <Table dataValue={data.filter(applyFilters)} columnsValue={columns} />
    </main>
  );
}
