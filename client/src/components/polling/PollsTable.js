import React, { useEffect } from "react";
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
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import ListIcon from "@material-ui/icons/List";
import CircularProgress from "@material-ui/core/CircularProgress";
import BarChartIcon from "@material-ui/icons/BarChart";

import TableActionButton from "../TableActionButton";

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

function PollsTable({
  handleEdit,
  handleAdd,
  handleDelete,
  handleView,
  openData,
  data,
  settings,
}) {
  const columns = [
    {
      title: "Poll Question",
      field: "question",
    },
    {
      title: "Poll Launched",
      render: (rowData) => <span>{rowData.isLaunched ? "Yes" : "No"}</span>,
    },
  ];

  const options = {
    actionsColumnIndex: -1,
    search: false,
    paging: false,

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

  const actions = [
    {
      icon: Edit,
      tooltip: "Edit Form",
      onClick: (event, rowData) => {
        console.log(rowData);
        handleEdit(rowData);
      },
    },
    (rowData) => ({
      icon: BarChartIcon,
      disabled: !rowData.isLaunched,
      tooltip: "View Results",
      onClick: (event, rowData) => {
        handleView(rowData);
        console.log(rowData);
      },
    }),
    {
      icon: () => <TableActionButton label="View Data" type="data" />,
      isFreeAction: true,
      onClick: (event) => {
        openData();
      },
    },
    {
      icon: () => <TableActionButton label="New Poll" type="add" />,
      isFreeAction: true,
      onClick: (event) => {
        handleAdd();
      },
    },
  ];

  return (
    <div className="shadow-border container-width">
      <MaterialTable
        title="Polls"
        columns={columns}
        data={data}
        options={options}
        icons={tableIcons}
        actions={actions}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleDelete(oldData.id);

              resolve();
            }),
        }}
        localization={{
          body: {
            emptyDataSourceMessage: settings.loaded ? (
              "No Polls Found. Create a new poll by click the + icon in the top right of the table"
            ) : (
              <div style={{ padding: "50px" }}>
                <CircularProgress />
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

export default connect(mapStateToProps, actions)(PollsTable);
