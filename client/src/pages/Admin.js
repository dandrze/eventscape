import React, { useEffect, useState } from "react";
import { forwardRef } from "react";

import { Link } from "react-router-dom";
import MaterialTable from "material-table";
import { Paper } from "@material-ui/core";

/*Material-Table Icons*/
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import FoldingCube from "../components/FoldingCube";

import api from "../api/server";

export default () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await api.get("/api/admin/data");
    setData(res.data);

    console.log(res);
  };

  const columns = [
    {
      title: "User Id",
      field: "Owner.id",
    },
    {
      title: "User First Name",
      field: "Owner.firstName",
    },
    {
      title: "User Email",
      field: "Owner.emailAddress",
    },
    {
      title: "Event Id",
      field: "id",
    },
    {
      title: "Event Title",
      field: "title",
    },
    {
      title: "Event Link",
      field: "link",
    },
    {
      title: "Event Start Date",
      render: (rowData) => (
        <span>
          {new Date(rowData.startDate).toLocaleString("en-us", {
            dateStyle: "long",
            timeStyle: "long",
          })}
        </span>
      ),
    },
    {
      title: "License",
      field: "License.basePrice",
    },
    {
      title: "License Price Per Viewer",
      field: "License.pricePerViewer",
    },
    {
      title: "License Max Streaming Time",
      field: "License.maxStreamingTime",
    },
  ];

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  const options = {
    actionsColumnIndex: -1,
    exportButton: true,
    exportAllData: true,
    showTitle: true,
    pageSize: 100,

    headerStyle: {
      backgroundColor: "#F0F1F4",
      color: "black",
      fontFamily: "Roboto, Helvetica Neue, Ariel, sans-serif",
      fontSize: "14px",
      fontWeight: "bold",
      margin: "30px",
    },

    cellStyle: {
      backgroundColor: "white",
      color: "black",
      fontFamily: "Roboto, Helvetica Neue, Ariel, sans-serif",
      fontSize: "14px",
      fontWeight: "300",
    },
  };

  return (
    <div className="form-box shadow-border">
      <MaterialTable
        title="Admin Dashboard"
        columns={columns}
        data={data}
        options={options}
        icons={tableIcons}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
      />
    </div>
  );
};
