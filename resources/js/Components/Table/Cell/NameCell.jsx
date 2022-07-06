import React from 'react';
import {Link} from "@inertiajs/inertia-react";

const NameCell = ({ value, row }) => {
  const action = row.values.rowActions ? row.values.rowActions[0] : row.values.rowAction;

  const getAction = () => {
    switch(action.name) {
      case 'Check':
        return action.disabled ? null : action.onClick()
      case 'edit':
        return action.disabled ? null : action.action()
    }
  }

  return (
    <a className='cursor-pointer' onClick={getAction}>
      <div className="flex items-center h-full overflow-hidden">
        <div className="flex-shrink-0 h-7 w-7">
          <img className="h-7 w-7 rounded-full object-cover" src={value.image ? value.image : '/img/no-user-photo.jpg'}
               alt=""/>
        </div>
        <div className="flex-shrink-1 pl-4">
          <div className="truncate">{value.name} {value.last_name}</div>
        </div>
      </div>
    </a>
  );
};


export default NameCell;
