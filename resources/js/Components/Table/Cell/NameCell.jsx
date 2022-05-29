import React from 'react';

const NameCell = ({ value }) => {
  return (
    <div className="flex items-center h-full overflow-hidden">
      <div className="flex-shrink-0 h-7 w-7">
        <img className="h-7 w-7 rounded-full object-cover" src={value.image ? value.image : '/img/no-user-photo.jpg'} alt="" />
      </div>
      <div className="flex-shrink-1 pl-4">
        <div className="truncate">{value.name} {value.last_name}</div>
      </div>
    </div>
  );
};

export default NameCell;