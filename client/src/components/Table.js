import React from 'react';
import { Table as FlowbiteTable } from 'flowbite-react';

const Table = ({ headers, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <FlowbiteTable hoverable={true}>
        <FlowbiteTable.Head>
          {headers.map((header, index) => (
            <FlowbiteTable.HeadCell key={index}>
              {header}
            </FlowbiteTable.HeadCell>
          ))}
        </FlowbiteTable.Head>
        <FlowbiteTable.Body>
          {data.map((row, rowIndex) => (
            <FlowbiteTable.Row
              key={rowIndex}
              className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:bg-gray-50"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {Object.values(row).map((cell, cellIndex) => (
                <FlowbiteTable.Cell key={cellIndex}>
                  {cell}
                </FlowbiteTable.Cell>
              ))}
            </FlowbiteTable.Row>
          ))}
        </FlowbiteTable.Body>
      </FlowbiteTable>
    </div>
  );
};

export default Table; 