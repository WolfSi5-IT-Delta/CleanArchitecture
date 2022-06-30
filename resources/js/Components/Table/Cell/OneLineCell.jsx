import React from "react";
import { Link } from "@inertiajs/inertia-react";
const OneLineCell = ({value}) => {
  return (
    <div className="w-full text-left overflow-hidden whitespace-pre-line">
      {value}
    </div>
  );
};

export const OneLineCellLesson = ({value, row}) => {
  return (
    <div className="w-full text-left overflow-hidden whitespace-pre-line">
      <Link href={route("admin.lesson.edit", row.original.id)}>{value}</Link>
    </div>
  );
};

export const OneLineCellGroup = ({value, row}) => {
  return (
    <div className="w-full text-left overflow-hidden whitespace-pre-line">
      <Link href={route("admin.groups.edit", row.original.id)}>{value}</Link>
    </div>
  );
};

export const OneLineCellDepartment = ({value, row}) => {
  return (
    <div className="w-full text-left overflow-hidden whitespace-pre-line">
      <Link href={route("admin.department.edit", row.original.id)}>{value}</Link>
    </div>
  );
};



export default OneLineCell;
