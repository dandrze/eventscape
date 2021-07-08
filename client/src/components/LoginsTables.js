import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { forwardRef } from "react";
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
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default function LoginsTable({ data }) {
  const columns = [
    {
      title: "First Name",
      field: "Registration.firstName",
      headerStyle: { display: "none" },
      cellStyle: { display: "none" },
    },
    {
      title: "Last Name",
      field: "Registration.lastName",
      headerStyle: { display: "none" },
      cellStyle: { display: "none" },
    },
    {
      title: "Last Name",
      field: "Registration.emailAddress",
      headerStyle: { display: "none" },
      cellStyle: { display: "none" },
    },
    {
      title: "First Login",
      field: "createdAt",
      headerStyle: { display: "none" },
      cellStyle: { display: "none" },
    },

    {
      title: "Total Time Viewed (in miliseconds)",
      field: "timeViewed",
      headerStyle: { display: "none" },
      cellStyle: { display: "none" },
    },
    {
      title: "First Name",
      render: (rowData) => (
        <span>{rowData["Registration.firstName"] || "Anonymous"}</span>
      ),
    },
    {
      title: "Last Name",
      render: (rowData) => (
        <span>{rowData["Registration.lastName"] || "Guest"}</span>
      ),
    },
    {
      title: "Email",
      render: (rowData) => (
        <span>{rowData["Registration.emailAddress"] || "n/a"}</span>
      ),
    },
    {
      title: "First Login",
      customSort: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (rowData) => (
        <span>
          {new Date(rowData.createdAt).toLocaleString("en-us", {
            dateStyle: "long",
            timeStyle: "long",
          })}
        </span>
      ),
    },
    {
      title: "Last Logout",
      customSort: (a, b) => new Date(a.lastLogout) - new Date(b.lastLogout),
      render: (rowData) => (
        <span>
          {rowData.lastLogout
            ? new Date(rowData.lastLogout).toLocaleString("en-us", {
                dateStyle: "long",
                timeStyle: "long",
              })
            : "Currently Logged In"}
        </span>
      ),
    },
    {
      title: "Total Time Viewed",
      customSort: (a, b) => a.timeViewed - b.timeViewed,
      render: (rowData) => (
        <span>
          {(rowData.timeViewed / 60000).toFixed(2).toString() + " Minutes"}
        </span>
      ),
    },
  ];

  const options = {
    actionsColumnIndex: -1,
    exportButton: true,
    exportAllData: true,
    showTitle: false,

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
    <MaterialTable
      title="Logins"
      columns={columns}
      data={data}
      options={options}
      icons={tableIcons}
      components={{
        Container: (props) => <Paper {...props} elevation={0} />,
      }}
    />
  );
}
