import React, {useState, useEffect, useContext, useCallback} from "react";
import { Inertia } from "@inertiajs/inertia";
import Table from "../../Components/Table/Table.jsx";
import OneLineCell from "../../Components/Table/Cell/OneLineCell.jsx";
import ButtonCell from "../../Components/Table/Cell/ButtonCell.jsx";
import Select from "react-select";
import Header from "../../Components/Header.jsx";
import axios from "axios";
import DateCell from "../../Components/Table/Cell/DateCell.jsx";
import NameCell from "../../Components/Table/Cell/NameCell";
import UserCell from "../../Components/Table/Cell/UserCell";

export default function ({ paginatedList }) {

  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedList.last_page);
  const list = paginatedList.data;
  // console.log(list);

  const columns = [
    {
      Header: "Student",
      accessor: (row) => {
        return {
          name: row.name + ' ' + (row.last_name ?? ''),
          actionName: 'edit',
          image: row.avatar,
        };
      },
      Filter: "",
      width: 250,
      Cell: UserCell,
    },
    {
      Header: "Assigned courses",
      accessor: "assignedCourses",
      Filter: "",
      width: 100,
      Cell: OneLineCell,
    },
    {
      Header: "Started courses",
      accessor: "startedCourses",
      Filter: "",
      width: 100,
      Cell: OneLineCell,
    },
    {
      Header: "Finished courses",
      accessor: "finishedCourses",
      Filter: "",
      width: 100,
      Cell: OneLineCell,
    },
    // {
    //   Header: "Start",
    //   accessor: "created_at",
    //   Filter: "",
    //   width: 150,
    //   Cell: DateCell,
    // },
    {
      Header: "",
      accessor: "rowAction",
      Filter: "",
      disableFilters: true,
      width: 250,
      Cell: ButtonCell,
    },
  ];

  const addActions = (items) => {
    return items.map((item) => {
      return {
        ...item,
        rowAction: {
          name: 'Get Info',
          onClick: () => Inertia.get(route("admin.teacher.student", item.id))
        },
      };
    });
  };

  const [data, setData] = useState(addActions(list));

  const fetchData = useCallback(({ pageIndex, pageSize, sort, sortBy }) => {
    setLoading(true);

    axios
      .get(`${route(route().current())}?page=${pageIndex}&perpage=${pageSize}&sort=${sort??''}&sortBy=${sortBy??''}`)
      .then((resp) => {
        setCurPage(Number(resp.data.current_page - 1));
        setControlledPageCount(resp.data.last_page);
        setData(addActions(resp.data.data));
      })
      .then(() => setLoading(false));
  }, []);

  const [searchUserId, setSearchUserId] = useState(null);
  const allUsers = list.map((item) => {
    return {
      value: item.id,
      label: `${item.name} ${item.last_name}`
    };
  });
  const handleUserSearch = (inputValue) => {
    setSearchUserId(inputValue === null ? null : inputValue.value);
  };

  return (
    <main className="w-full h-fit">
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
      <Header title='Students'/>

      <div className="w-full pb-4 flex gap-10">
        <div className="w-80">
          Student:
          <Select
            placeholder="Select User"
            className="basic-single"
            classNamePrefix="select"
            options={[
              ...new Map(
                allUsers.map((item) => [item["value"], item])
              ).values(),
            ]}
            isClearable
            onChange={handleUserSearch}
          />
        </div>

      </div>


      <Table
        dataValue={data}
        columnsValue={columns}
        controlledPageCount={controlledPageCount}
        total={paginatedList.total}
        fetchData={fetchData}
        loading={loading}
        curPage={curPage}
        perPage={paginatedList.per_page}
      />

      </div>
    </main>
  );
}
