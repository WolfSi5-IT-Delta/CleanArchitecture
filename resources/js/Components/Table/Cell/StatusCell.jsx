import React from "react";

const StatusCell = ({ value }) => {
  let status = value;
  let text = "";
  switch (status) {
    case 0:
    case false: 
      status = 'Inactive';
      text = "bg-red-100 text-red-800"
      break;

    case "not_started": 
      status = "not started"; 
      text = "bg-red-100 text-red-800"
      break;

    case "in_progress":
    case "pending": 
      status = "in progress"; 
      text = "bg-yellow-100 text-yellow-800"
      break;
    
    case true:
    case 1:
      status = 'Active';
      text = "bg-green-100 text-green-800"
      break;

    case "done":
      status = "done"; 
      text = "bg-green-100 text-green-800"
      break;

    default:
  }

  return (
    <span className={`${text} px-2 max-h-6 justify-left inline-flex text-xs leading-5 font-semibold rounded-full`}>
      {status}
    </span>
  )

};

export default StatusCell;
