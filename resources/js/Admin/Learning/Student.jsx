import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm } from "@inertiajs/inertia-react";
import Header from "../../Components/AdminPages/Header.jsx";
import Table from "../../Components/Table/Table.jsx";
import OneLineCell from "../../Components/Table/Cell/OneLineCell.jsx";
import NameCell from "../../Components/Table/Cell/NameCell.jsx";
import StatusCell from "../../Components/Table/Cell/StatusCell.jsx";
import { UserNameAndAvatar } from "../../Components/AdminPages/Page.jsx";

export default function Student({ studentInfo }) {
  
  const { data, setData, post } = useForm(studentInfo.courses);

  const columns = React.useMemo(
    () =>  [
      {
        Header: "Assigned courses",
        accessor: (row) => {
          return {
            name: row.name,
            image: row.image,
          };
        },
        Filter: "",
        width: 250,
        Cell: NameCell,
      },
      {
        Header: "Status",
        accessor: 'status',
        Filter: "",
        width: 100,
        Cell: StatusCell,
      },
      {
        Header: "Progress",
        accessor: (row) => `${row.progress}%`,
        Filter: "",
        width: 100,
        Cell: OneLineCell,
      },
      {
        id: 'expander',
        Header: '',
        Cell: ({ row }) => {
            return row.original.lessons?.length ? (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth * 2}rem`,
                  },
                })}
              >
                <button
                  type="button"
                  className={
                    `bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500
                    inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2`
                  }
                >
                  {row.isExpanded ? 'Hide' : 'Lessons'}
                </button>
                
              </span>
            ) : null
        },
        width: 100,
        disableFilters: true,
      },
  ], []);


  const renderLessons = React.useCallback(
    ({ row }) => {

      const columns = [
        {
          Header: 'Lesson',
          accessor: (row) => {
            return {
              name: row.name,
              actionName: 'showLesson',
            };
          },
          Filter: "",
          width: 250,
          Cell: NameCell,
        },
        {
          Header: 'Status',
          accessor: 'status',
          Filter: "",
          width: 100,
          Cell: StatusCell,
        },
        {
          Header: '',
          accessor: "rowActions",
          disableFilters: true,
          // Filter: "",
          width: 10,
          Cell: () => {},
        },

      ];

      const addActions = (items) => {
        return items.map((item) => {
          return {
            ...item,
            rowActions: [
              {
                name: 'showLesson',
                type: 'button',
                action: () => {
                  console.log(111);
                  Inertia.get(route("admin.teacher.lesson", item.id))
                },
              }
            ],
          };
        });
      };

      const data = addActions(row.original?.lessons);

      console.log(data)
      return (
        <div className="p-4 max-w-screen-lg mx-auto">
          <Table
            dataValue={data}
            columnsValue={columns}
            options={{
              showPagination: false
            }}
          />
        </div>
    )}, []);

  return (
    <main>
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
        <Header title={'Student`s detail information'}/>

        <UserNameAndAvatar
          name={studentInfo.name}
          avatar={studentInfo.avatar}
        />

        <div className="py-5">
          <Table
            dataValue={data}
            columnsValue={columns}
            renderRowSubComponent={renderLessons}
          />
        </div> 

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-3 sm:grid-flow-row-dense pb-4">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
            onClick={() => Inertia.get(route('admin.teacher.students'))}
          >
            Ok
          </button>
        </div>
      </div>
    </main>
  );
}
