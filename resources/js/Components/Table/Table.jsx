import React, { Fragment, useState, useEffect, useRef } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useResizeColumns,
  useFlexLayout,
  useExpanded,
} from "react-table";
import {
  SortAscendingIcon,
  SortDescendingIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SelectorIcon,
  CheckIcon,
  PencilIcon,
  ClipboardCheckIcon,
} from "@heroicons/react/outline";
import { Listbox, Transition } from "@headlessui/react";
import ColumnFilter from "../ColumnFilter.jsx";
// import GlobalFilter from './GlobalFilter.jsx';
// import EditableCell from './EditableCell.jsx';

function getNoun(number, one, two, five) {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
}

export default function Table({
  dataValue: data,
  columnsValue,
  renderRowSubComponent,
  loc,
  ...props
}) {
  // todo integrate sorting with requests
  const {
    options: {
      showGlobalFilter = false,
      showColumnSelection = false,
      showElementsPerPage = true,
      showGoToPage = false,
      showPagination = true,
      showRowCheckboxes = false,
    } = {
      showGlobalFilter,
      showColumnSelection,
      showElementsPerPage,
      showGoToPage,
      showPagination,
      showRowCheckboxes,
    },
    fetchData = null,
    controlledPageCount = null,
    loading = false,
    total = null,
    curPage = 0,
    pageSizes = null,
    perPage = 10
  } = props;

  const localData = JSON.parse(localStorage.getItem(loc));
  const localPageIndex = localData ? localData.pageIndex : curPage;
  const localPageSize = localData ? localData.pageSize : perPage;
  const columns = React.useMemo(() => columnsValue, []);

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: 150,
      maxWidth: 400,
      // DefaultFilter
      Filter: ColumnFilter,
      // Cell: EditableCell
    }),
    []
  );

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      );
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    previousPage,
    nextPage,
    allColumns,
    visibleColumns,
    getToggleHideAllColumnsProps,
    setPageSize,
    state,
    state: { pageIndex, pageSize, expanded },
    selectedFlatRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: localPageIndex, pageSize: localPageSize },
      manualPagination: controlledPageCount !== null,
      pageCount: controlledPageCount,
      autoResetSortBy: false
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useFlexLayout,
    useResizeColumns,
    // (hooks) => {
    //   if (showRowCheckboxes === true) {
    //     hooks.visibleColumns.push((columns) => [
    //       // Let's make a column for selection
    //       {
    //         id: "selection",
    //         disableResizing: true,
    //         minWidth: 50,
    //         width: 250,
    //         maxWidth: 250,
    //         // The header can use the table's getToggleAllRowsSelectedProps method
    //         // to render a checkbox
    //         Header: ({ getToggleAllRowsSelectedProps }) => (
    //           <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
    //         ),
    //         // The cell can use the individual row's getToggleRowSelectedProps method
    //         // to the render a checkbox
    //         Cell: ({ row }) => (
    //           <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
    //         ),
    //         disableFilters: true,
    //       },
    //       ...columns,
    //     ]);
    //   }
    //   hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    //     // fix the parent group of the selection button to not be resizable
    //     const selectionGroupHeader = headerGroups[0].headers[0];
    //     selectionGroupHeader.canResize = false;
    //   });
    // }
  );

  const { globalFilter } = state;
  // Update the state when input changes

  const filter = props.filter;
  const [sorting, setSorting] = useState({});
  useEffect(() => {localStorage.setItem(loc,JSON.stringify({pageSize:pageSize,pageIndex:pageIndex}))},[pageSize, pageIndex])
  useEffect(() => {
    if (fetchData !== null && loading !== true) {
      fetchData({ pageIndex: pageIndex + 1, pageSize, filter,
        sort:sorting?.sort, sortBy:sorting?.sortBy });
    }
  }, [fetchData, pageSize, pageIndex, filter, sorting]);

  useEffect(()=>{
    let sort, sortBy;
    if (state.sortBy.length) {
      sort = state.sortBy[0]?.id;
      sortBy = state.sortBy[0]?.desc ? 'desc' : 'asc';
    }
    setSorting({ sort, sortBy })

  }, [state.sortBy[0]?.desc, state.sortBy[0]?.id])

  const SortingIndicator = ({ column, className }) => {
    if (column.isSorted) {
      if (column.isSortedDesc) {
        return <SortDescendingIcon className={className} />;
      }
      return <SortAscendingIcon className={className} />;
    }

    if (column.disableFilters !== true) {
      return <SelectorIcon className={`${className} text-gray-300`} />;
    }
    return null;
  };

  // VisibleColumnsSelector is not usable in current state it have to be remade if we need it
  // const VisibleColumnsSelector = () => {
  //   return (
  //     <Listbox onChange={() => null}>
  //       {({open}) => (
  //         <>
  //           <div className="relative flex items-center" style={{width: '220px'}}>
  //             <Listbox.Button
  //               className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
  //             >
  //               <span className="block truncate -ml-3 -mr-10 -my-2 pl-3 pr-10 py-2">Выбрать столбцы</span>
  //               <span className="ab2solute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
  //                 <SelectorIcon className="h-5 w-5 text-gray-600" aria-hidden="true"/>
  //               </span>
  //             </Listbox.Button>
  //
  //             <Transition
  //               show={open}
  //               as={Fragment}
  //               leave="transition ease-in duration-100"
  //               leaveFrom="opacity-100"
  //               leaveTo="opacity-0"
  //             >
  //               <Listbox.Options as="div"
  //                                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm bottom-9">
  //                 {allColumns.map((column) => (
  //                   <Listbox.Option
  //                     as="label"
  //                     key={`${column.id}Selector`}
  //                     className={({active}) => `
  //                             ${active
  //                       ? 'bg-gray-200'
  //                       : 'text-gray-900'
  //                     } cursor-pointer relative px-4 py-2 min-w-full block`
  //                     }
  //                     value={column.id}
  //                   >
  //                     {() => (
  //                       <>
  //                         <input type="checkbox"
  //                                className="form-checkbox h-5 w-5 text-gray-600" {...column.getToggleHiddenProps()} />
  //                         <span className={
  //                           `${column.isVisible
  //                             ? 'font-semibold'
  //                             : 'font-normal'
  //                           } ml-2 truncate text-xs'`
  //                         }
  //                         >
  //                           {column.id}
  //                         </span>
  //                       </>
  //                     )}
  //                   </Listbox.Option>
  //                 ))}
  //               </Listbox.Options>
  //             </Transition>
  //           </div>
  //         </>
  //       )}
  //     </Listbox>
  //   );
  // };

  const NumberOfElementsSelector = () => {
    const pSizes =
      pageSizes === null
        ? [3, 10, 20, 50, 100, total ?? data.length]
        : [...pageSizes, total ?? data.length];
    const getLocalizedNumberOfElements = (number) => {
      return getNoun(number, "элемент", "элемента", "элементов");
    };

    return (
      <Listbox
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e));
        }}
      >
        {({ open }) => (
          <>
            <div
              className="relative flex items-center"
              style={{ width: "220px" }}
            >
              <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                <span className="block truncate">
                  {`Показать ${
                    pageSize === (total ?? data.length)
                      ? `все элементы`
                      : `${pageSize} ${getLocalizedNumberOfElements(pageSize)}`
                  }`}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-600"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm bottom-8">
                  {pSizes.map((pSize, i) => (
                    <Listbox.Option
                      key={`pSize${i === pSizes.length - 1 ? `All` : pSize}`}
                      className={({ active }) => `
                      ${
                        active ? "bg-gray-200" : "text-gray-900"
                      } cursor-default select-none relative py-2 pl-8 pr-4`}
                      value={pSize}
                    >
                      {() => (
                        <>
                          <span
                            className={`${
                              pageSize === pSize
                                ? "font-semibold"
                                : "font-normal"
                            } block truncate text-xs'`}
                          >
                            {`Показать ${
                              i === pSizes.length - 1
                                ? `все элементы`
                                : `${pSize} ${getLocalizedNumberOfElements(
                                    pSize
                                  )}`
                            }`}
                          </span>

                          {pageSize === pSize ? (
                            <span
                              className={`${
                                pageSize === pSize
                                  ? "text-gray-600"
                                  : "text-indigo-600"
                              } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    );
  };

  // PageSelector is deprecated. If you want to use it, you have to rewrite it with new pagination system
  // const PageSelector = () => {
  //   const [pageToGo, setPageToGo] = useState(pageIndex + 1);
  //   return (
  //     <div>
  //       <label htmlFor="goToPage" className="block text-sm font-medium text-gray-700 max-w-fit">
  //         Перейти на страницу
  //       </label>
  //       <div className="mt-1 flex rounded-md shadow-sm">
  //         <div className="relative flex items-stretch flex-grow focus-within:z-10">
  //           <input
  //             type="number"
  //             name="goToPage"
  //             value={pageToGo}
  //             min={1}
  //             max={pageCount}
  //             id="goToPage"
  //             className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
  //             placeholder="John Doe"
  //             onChange={(e) => setPageToGo(e.target.value)}
  //           />
  //         </div>
  //         <button
  //           type="button"
  //           className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
  //           onClick={() => gotoPage(pageToGo - 1)}
  //         >
  //           <span>Перейти</span>
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  const Pagination = () => {
    return (
      <div className="flex items-center justify-between min-w-full">
        <div className="flex-1 flex flex-wrap justify-between sm:hidden">
          {showElementsPerPage && (
            <div className="w-full flex justify-center mb-2">
              <NumberOfElementsSelector />
            </div>
          )}
          <div className="w-full flex justify-between">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={previousPage}
              disabled={!canPreviousPage}
              key="buttonPrev"
            >
              Previous
            </button>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={nextPage}
              disabled={!canNextPage}
              key="buttonNext"
            >
              Next
            </button>
          </div>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          {showElementsPerPage && <NumberOfElementsSelector />}
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={previousPage}
                disabled={!canPreviousPage}
                key="prev"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
              {pageOptions.map((item) => {
                if (
                  item === 0 ||
                  item === pageCount - 1 ||
                  item === pageIndex - 1 ||
                  item === pageIndex ||
                  item === pageIndex + 1
                ) {
                  return (
                    <button
                      className={`${
                        item === pageIndex
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "border-gray-300 text-gray-500 hover:bg-gray-50"
                      }
                            relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white`}
                      key={`paginationItem${item}`}
                      onClick={() => gotoPage(item)}
                    >
                      {item + 1}
                    </button>
                  );
                }
                if (item === pageIndex - 2 || item === pageIndex + 2) {
                  return (
                    <button
                      className="border-gray-300 text-gray-500 relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white"
                      key={`dots${item}`}
                    >
                      ...
                    </button>
                  );
                }
                return null;
              })}
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={nextPage}
                disabled={!canNextPage}
                key="next"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">

            <table
              {...getTableProps}
              className="min-w-full divide-y divide-gray-200"
            >

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
                            <span className="relative"
                            >
                                {column.render("Header")}
                                <SortingIndicator
                                  column={column}
                                  className="absolute top-0 -right-4 w-4 h-4"
                                />
                            </span>
                          </div>

                          {/* {column.canFilter ? column.render("Filter") : null}

                          {column.disableResizing !== true ? (
                            <div
                              className={`resizer isResizing`}
                              {...column.getResizerProps()}
                            ></div>
                          ) : null} */}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps}>
                {
                  // Loop over the table rows
                  page.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row);
                    return (
                      <React.Fragment key={i}>
                        <tr
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
                                  className="px-6 py-3 font-medium whitespace-nowrap flex items-center"
                                  // className={`p-2 whitespace-nowrap text-sm text-gray-500 justify-center ${idx === row.cells.length - 1 ? '' : 'border-r'} border-gray-300 flex flex-wrap items-center overflow-hidden`}
                                  {...cell.getCellProps()}
                                >
                                  {cell.render("Cell")}
                                </th>
                              );
                            })
                          }
                        </tr>
                        {/* subComponent */}
                        {row.isExpanded ? (
                          <tr>
                            <td colSpan={visibleColumns.length}>
                              {renderRowSubComponent({ row })}
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <div className="px-2 pt-3 flex flex-wrap items-center justify-center sm:justify-between w-full space-y-2 sm:space-y-0">
        {showColumnSelection && <VisibleColumnsSelector/>}
      </div> */}
      {showPagination && (
        <div className="px-2 py-3 flex flex-wrap items-center justify-center w-full space-y-2">
          <Pagination />
        </div>
      )}
      {/* <div className="px-2 py-3 flex flex-wrap items-center justify-center w-full space-y-2">
        {showGoToPage && <PageSelector/>}
        {showPagination && <Pagination />}
      </div> */}
      {/* <div className="px-2 py-3 flex flex-wrap items-center justify-center w-full space-y-2">
        {props.buttons !== undefined && props.buttons}
      </div> */}
    </div>
  );
}
