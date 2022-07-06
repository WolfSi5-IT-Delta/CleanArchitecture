import React from "react";
const CellWithLink = ({value,row}) => {

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
    <div className="w-full text-left overflow-hidden whitespace-pre-line">
      <a className={action.disabled ? '' : 'cursor-pointer'}
         onClick={getAction}>{value}</a>
    </div>
  );
};


export default CellWithLink;
