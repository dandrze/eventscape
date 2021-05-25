import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import { forwardRef } from "react";

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
import FoldingCube from "../FoldingCube";

import TableActionButton from "../TableActionButton";

import api from "../../api/server";

import * as actions from "../../actions";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => (
    <TableActionButton {...props} ref={ref} type="export" label="Export" />
  )),
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

function PollDataTable({ settings, event }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await api.get("/api/polling/data", {
      params: { eventId: event.id },
    });
    setData(res.data);
  };

  console.log(data);

  const columns = [
    {
      title: "Visitor Id",
      field: "SiteVisitor.id",
      headerStyle: { display: "none" },
      cellStyle: { display: "none" },
    },
    {
      title: "First Name",
      field: "SiteVisitor.Registration.firstName",
      headerStyle: { display: "none" },
      cellStyle: { display: "none" },
    },
    {
      title: "Last Name",
      field: "SiteVisitor.Registration.lastName",
      headerStyle: { display: "none" },
      cellStyle: { display: "none" },
    },
    {
      title: "Email Address",
      field: "SiteVisitor.Registration.emailAddress",
      headerStyle: { display: "none" },
      cellStyle: { display: "none" },
    },
    {
      title: "First Name",
      render: (rowData) => (
        <span>
          {rowData["SiteVisitor.Registration.firstName"] ||
            "Guest " + rowData["SiteVisitor.id"]}
        </span>
      ),
    },
    {
      title: "Last Name",
      render: (rowData) => (
        <span>{rowData["SiteVisitor.Registration.lastName"] || "n/a"}</span>
      ),
    },
    {
      title: "Email Address",
      render: (rowData) => (
        <span>{rowData["SiteVisitor.Registration.emailAddress"] || "n/a"}</span>
      ),
    },
    {
      title: "Poll",
      field: "PollOption.Poll.question",
      defaultSort: "asc",
    },
    {
      title: "Poll Option",
      field: "PollOption.text",
    },
  ];

  const options = {
    actionsColumnIndex: -1,
    search: true,
    exportButton: true,
    exportAllData: true,

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
      fontWeight: "normal",
    },
  };

  return (
    <div className="shadow-border container-width" style={{ width: "700px" }}>
      <MaterialTable
        title="Poll Responses"
        columns={columns}
        data={data}
        options={options}
        icons={tableIcons}
        localization={{
          body: {
            emptyDataSourceMessage: settings.loaded ? (
              "No poll responses."
            ) : (
              <div style={{ padding: "50px" }}>
                <FoldingCube />
              </div>
            ),
          },
        }}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { email: state.email, settings: state.settings, event: state.event };
};

export default connect(mapStateToProps, actions)(PollDataTable);
