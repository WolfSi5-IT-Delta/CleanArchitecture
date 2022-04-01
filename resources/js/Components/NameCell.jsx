import React from 'react';

const NameCell = ({ value }) => {
  return (
    <div className="flex">
      <div className="flex-shrink-0 h-7 w-7">
        <img className="h-7 w-7 rounded-full object-cover" src={value.image} alt="" />
      </div>
      <div className="ml-4">
        <div className="whitespace-nowrap">{value.name} <span>{value.last_name}</span></div>
        <div className="whitespace-nowrap">{value.signature}</div>
      </div>
    </div>
  );
};

export default NameCell;
