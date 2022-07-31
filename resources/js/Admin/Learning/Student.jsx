import React, { useContext } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm } from "@inertiajs/inertia-react";
import { AdminContext } from "../reducer.jsx";
import { Switch } from "@headlessui/react";
import Header from "../../Components/Header.jsx";
import ExpandedTable from "../../Components/Table/ExpandedTable.jsx";
import OneLineCell from "../../Components/Table/Cell/OneLineCell.jsx";
import ActionsCell from "../../Components/Table/Cell/ActionsCell.jsx";
import NameCell from "../../Components/Table/Cell/UserCell.jsx";

export default function Student({ studentInfo }) {
  
  const { data, setData, post } = useForm(studentInfo.courses);

  console.log(studentInfo);

  const columns = [
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
      accessor: (row) => {
        let status = row.status;
        let text = "";
        switch (status) {
          case "not_started": 
            status = "not started"; 
            text = "bg-red-100 text-red-800"
            break;

          case "in_progress": 
            status = "in progress"; 
            text = "bg-yellow-100 text-yellow-800"
            break;
          
          case "done": 
            status = "done"; 
            text = "bg-green-100 text-green-800"
            break;

          default:
        }
        return (
          <span className={`${text} px-2 m-auto max-h-6 justify-center inline-flex text-xs leading-5 font-semibold rounded-full`}>
            {status}
          </span>
        )
      },
      Filter: "",
      width: 100,
      Cell: OneLineCell,
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
    // {
    //   Header: "",
    //   accessor: "rowActions",
    //   Filter: "",
    //   disableFilters: true,
    //   width: 200,
    //   Cell: ActionsCell,
    // },
  ];

  return (
    <main>
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
        <Header title={'Student`s detail information'}/>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="flex items-center">
              <img className="h-12 w-12 rounded-full overflow-hidden object-cover" src={studentInfo.avatar} alt=""/>
              <div className="ml-2 max-w-2xl text-gray-500">
                {studentInfo.name}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6">
          {/* <h2>assignedCourses</h2> */}
          {/* {studentInfo.assignedCourses.map(e => (
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              {e.name}
            </p>
          ))} */}
        </div>

        <ExpandedTable
          dataValue={data}
          columnsValue={columns}
        />

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
