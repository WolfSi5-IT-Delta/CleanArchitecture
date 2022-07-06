import React, {useState, useEffect, useContext, useCallback} from "react";
import { Inertia } from "@inertiajs/inertia";
import Table from "../../Components/Table/Table.jsx";
import OneLineCell from "../../Components/Table/Cell/OneLineCell.jsx";
import ButtonCell from "../../Components/Table/Cell/ButtonCell.jsx";
import Select from "react-select";
import Header from "../../Components/Header.jsx";
import axios from "axios";
import DateCell from "../../Components/Table/Cell/DateCell.jsx";

export default function ({ paginatedList }) {

  console.log(paginatedList)
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [controlledPageCount, setControlledPageCount] = useState(paginatedList.last_page);
  const list = paginatedList.data;

  const columns = [
    {
      Header: "Student",
      accessor: "user_id",
      Filter: "",
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: "Course",
      accessor: "course_id",
      Filter: "",
      width: 250,
      Cell: OneLineCell,
    },
    {
      Header: "Start",
      accessor: "created_at",
      Filter: "",
      width: 250,
      Cell: DateCell,
    },
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
          onClick: () => Inertia.get(route("admin.teacher.lesson", item.id))
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


  return (
    <main className="w-full h-fit">
      <div className="shadow bg-white px-4 pt-1 pb-4 rounded-xl border-b border-gray-200 sm:px-6">
      <Header title='Students'/>

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
