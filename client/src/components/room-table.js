import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import { Paper } from "@material-ui/core";
import { toast } from "react-toastify";

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
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";
import api from "../api/server";

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

const RoomTable = (props) => {
  const [data, setData] = useState([]);
  const [loadingCheckboxes, setLoadingCheckboxes] = useState(0);

  useEffect(() => {
    setData(props.rooms);
  }, [props.rooms]);

  const handleChangeCheckbox = async (event, rowData) => {
    setLoadingCheckboxes(rowData.id);
    const chatEnabled =
      event.target.name === "chat" ? event.target.checked : rowData.chatEnabled;
    const questionsEnabled =
      event.target.name === "questions"
        ? event.target.checked
        : rowData.questionsEnabled;

    if (!chatEnabled && !questionsEnabled) {
      toast.error("At least one tab must be enabled");
    } else {
      const response = await api.put("/api/chatroom/tab-set-enabled", {
        roomId: rowData.id,
        chatEnabled,
        questionsEnabled,
      });

      await props.fetchData();
    }

    setLoadingCheckboxes(0);
  };

  const columns = [
    {
      title: "Room Name",
      field: "name",
    },
    {
      title: "Chat Tab",
      render: (rowData) =>
        loadingCheckboxes === rowData.id ? (
          <CircularProgress size={24} />
        ) : (
          <Checkbox
            checked={rowData.chatEnabled}
            name="chat"
            onChange={(event) => handleChangeCheckbox(event, rowData)}
          />
        ),
    },
    {
      title: "Ask a Question Tab",
      render: (rowData) =>
        loadingCheckboxes === rowData.id ? (
          <CircularProgress size={24} />
        ) : (
          <Checkbox
            checked={rowData.questionsEnabled}
            name="questions"
            onChange={(event) => handleChangeCheckbox(event, rowData)}
          />
        ),
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

  return (
    <div>
      <MaterialTable
        title=""
        columns={columns}
        data={data}
        options={options}
        icons={tableIcons}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise(async (resolve) => {
              console.log(newData);
              await props.addChatRoom(newData, props.event.id);
              await props.fetchData();
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(async (resolve) => {
              await props.updateChatRoom(newData);
              await props.fetchData();
              resolve();
            }),
          onRowDelete: (oldData) =>
            new Promise(async (resolve) => {
              await props.deleteChatRoom(oldData.id);
              await props.fetchData();
              resolve();
            }),
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(RoomTable);
