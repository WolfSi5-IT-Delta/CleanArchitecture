import React from "react";

const StatusCell = ({ value }) => {
  let status = value;
  let text = "";

  const red = "bg-red-100 text-red-800";
  const green = "bg-green-100 text-green-800";
  const yellow = "bg-yellow-100 text-yellow-800";

  switch (status) {

  // RED  
    case 'fail':
      status='fail';
      text = red;
      break;
  
    case 'blocked':
      status='Blocked';
      text = red;
      break;    

    case 0:
    case false: 
      status = 'Inactive';
      text = red
      break;

    case "not_started": 
      status = "not started"; 
      text = red;
      break;

  // YELLOW
    case "in_progress":
    case "pending": 
      status = "in progress"; 
      text = yellow;
      break;
    
  // GREEN
    case true:
    case 1:
    case 'active':
      status = 'Active';
      text = green;
      break;

    case "done":
      status = "done"; 
      text = green;
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
