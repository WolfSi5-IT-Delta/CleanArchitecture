import React from 'react';

const NameCell = ({value, row}) => {
  const actionName = value.actionName;
  const action = row.values.rowActions?.find(e => e.name === actionName)?.action;

  return (
    <a className={`truncate ${ actionName ? 'cursor-pointer' : ''}`} onClick={action}>
      <div className="flex items-center h-full">
          { value.image ? (
            <div className="flex-shrink-0 h-7 w-7 mr-4">
              <img className="h-7 w-7 rounded-full object-cover" src={value.image} alt=""/>
            </div>
          ) : ''}
          <div className="flex-shrink-1">
            <div className={` ${ actionName ? 'text-indigo-600 hover:text-indigo-900' : ''}`}>{value.name}</div>
          </div>
      </div>
    </a>
  );
};

export default NameCell;
