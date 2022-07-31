import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import PerPageSelector from "./PerPageSelector";

export default function Pagination(props) {
  const {
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    pageIndex,
    pageSize,
    setPageSize,
    pageSizes,
    gotoPage,
    showElementsPerPage = true
  } = props;

  return (
    <div className="flex items-center justify-between min-w-full">
      <div className="flex-1 flex flex-wrap justify-between sm:hidden">
        {showElementsPerPage && (
          <div className="w-full flex justify-center mb-2">
            <PerPageSelector 
               pageSize={pageSize}
               setPageSize={setPageSize}
               pageSizes={pageSizes}
            />
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
        {showElementsPerPage && 
         <PerPageSelector 
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageSizes={pageSizes}
         />}
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
            {pageOptions?.map((item) => {
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
}
