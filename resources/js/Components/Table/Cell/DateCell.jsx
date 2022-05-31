import React from "react";

const DateCell = ({ value }) => {
  let localDate = new Date(value)
  return (
    <div className="w-full grid grid-cols-2 text-left overflow-hidden whitespace-pre-line">
      <span className="justify-self-center">
        {localDate.toLocaleDateString()} 
      </span>
      <span className="justify-self-center">
        {localDate.toLocaleTimeString()}
      </span>
    </div>
  );
};

export default DateCell;
