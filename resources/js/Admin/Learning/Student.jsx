import React, { useContext } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm } from "@inertiajs/inertia-react";
import { AdminContext } from "../reducer.jsx";
import { Switch } from "@headlessui/react";
import Header from "../../Components/Header.jsx";

export default function Student({ studentInfo }) {
  
  const { data, setData, post } = useForm();

  return (
    <main>
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
          <Header title={'Student`s detail information'}/>
        <div className="px-4 py-5 sm:px-6">
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            {studentInfo.name}
          </p>
        </div>

        <div className="px-4 py-5 sm:px-6">
          <h2>assignedCourses</h2>
          {studentInfo.assignedCourses.map(e => (
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              {e.name}
            </p>
          ))}
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <h2>startedCourses</h2>
          {studentInfo.assignedCourses.map(e => (
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              {e.name}
            </p>
          ))}
        </div>

        <div className="px-4 py-5 sm:px-6">
          <h2>finishedCourses</h2>
          {studentInfo.assignedCourses.map(e => (
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              {e.name}
            </p>
          ))}
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
