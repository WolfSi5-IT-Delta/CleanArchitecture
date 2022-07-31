import React, { Fragment, useState, useEffect, useRef } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFlexLayout,
  useExpanded,
} from "react-table";
import {
  SortAscendingIcon,
  SortDescendingIcon,
} from "@heroicons/react/outline";
import Pagination from "./Pagination";

export default function ExpandedTable({
  dataValue: data,
  columnsValue,
  ...props
}) {
  const {
    options: {
      // showGlobalFilter = false,
      // showColumnSelection = false,
      showElementsPerPage = true,
      showGoToPage = false,
      showPagination = true,
      // showRowCheckboxes = false,
    } = {
      // showGlobalFilter,
      // showColumnSelection,
      showElementsPerPage,
      showGoToPage,
      showPagination,
      // showRowCheckboxes,
    },
    // fetchData = null,
    // controlledPageCount = null,
    loading = false,
    total = data.length,
    curPage = 0,
    pageSizes = [3,10,20,50],
    perPage = 10,
  } = props;

  const columns = React.useMemo(() => columnsValue, []);

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 100,
      maxWidth: 300,
      // DefaultFilter
      // Filter: ColumnFilter,
      // Cell: EditableCell
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    previousPage,
    nextPage,
    // allColumns,
    // getToggleHideAllColumnsProps,
    setPageSize,
    // state,
    state: { pageIndex, pageSize },
    // selectedFlatRows,
    // setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // initialState: { pageIndex: curPage, pageSize: perPage },
      // manualPagination: controlledPageCount !== null,
      // pageCount: controlledPageCount,
      autoResetSortBy: false,
    },
    // useGlobalFilter,
    // useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    // useRowSelect,
    useFlexLayout
    // useResizeColumns,
  );

  // const { globalFilter } = state;
  // Update the state when input changes

  // const filter = props.filter;
  const [sorting, setSorting] = useState({});

  // useEffect(()=>{
  //   console.log(state.sortBy);
  //   let sort, sortBy;
  //   if (state.sortBy.length) {
  //     sort = state.sortBy[0]?.id;
  //     sortBy = state.sortBy[0]?.desc ? 'desc' : 'asc';
  //   }
  //   setSorting({ sort, sortBy })

  // }, [state.sortBy[0]?.desc, state.sortBy[0]?.id])

  const SortingIndicator = ({ column, className }) => {
    if (column.isSorted) {
      if (column.isSortedDesc) {
        return <SortDescendingIcon className={className} />;
      }
      return <SortAscendingIcon className={className} />;
    }

    // if (column.disableFilters !== true) {
    //   return <SelectorIcon className={`${className} text-gray-300`} />;
    // }
    return null;
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">

            <table className="min-w-full divide-y divide-gray-200" {...getTableProps}>

              <thead className="bg-gray-100 ">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, idx) => {
                      const getSortByToggleProps = {
                        ...column.getSortByToggleProps(),
                      };
                      return (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps()}
                        >
                          <div
                            className="flex w-full items-center"
                            {...(column.disableFilters
                              ? null
                              : getSortByToggleProps)}
                          >
                            <span className="relative">
                              {column.render("Header")}
                              <SortingIndicator
                                column={column}
                                className="absolute top-0 -right-4 w-4 h-4"
                              />
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {
                  // Loop over the table rows
                  rows.map((row, i) => {
                    prepareRow(row);
                    return (
                      // Apply the row props
                      <>
                        <tr
                          key={i}
                          className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-300`}
                          // className="bg-white "
                          {...row.getRowProps()}
                        >
                          {
                            // Loop over the rows cells
                            row.cells.map((cell, idx) => {
                              // Apply the cell props
                              return (
                                <th
                                  className="px-6 py-4 font-medium whitespace-nowrap flex items-center"
                                  // className={`p-2 whitespace-nowrap text-sm text-gray-500 justify-center ${idx === row.cells.length - 1 ? '' : 'border-r'} border-gray-300 flex flex-wrap items-center overflow-hidden`}
                                  {...cell.getCellProps()}
                                >
                                  {cell.render("Cell")}
                                </th>
                              );
                            })
                          }
                        </tr>
                        {row.isExpanded ? (
                          <tr>
                            <th>111</th>
                          </tr>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  })
                }
              </tbody>
            </table>

          </div>
        </div>
      </div>

      <div className="px-2 py-3 flex flex-wrap items-center justify-center w-full space-y-2">
        {showPagination && (
          <Pagination
            previousPage={previousPage}
            nextPage={nextPage}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            pageOptions={pageOptions}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            showElementsPerPage={showElementsPerPage}
            gotoPage={gotoPage}
            pageSizes={pageSizes}
          />
        )}
      </div>

      <div className="px-2 py-3 flex flex-wrap items-center justify-center w-full space-y-2">
        {props.buttons !== undefined && props.buttons}
      </div>
      
    </div>
  );
}
