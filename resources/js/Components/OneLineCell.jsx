import React from 'react';

const OneLineCell = ({ value }) => {
  return (
    <div
      className="w-full text-left truncate" //title={String(value)}
    >
      { value }
    </div>
  );
};

export default OneLineCell;
