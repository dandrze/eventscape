import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import NavBar3 from "../components/navBar3.js";
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
import Modal1 from "../components/Modal1";
import TableActionButton from "../components/TableActionButton";

const Permissions = (props) => {
  const [data, setData] = useState([]);
  const [openEditor, setOpenEditor] = useState(false);
  const [collaborator, setCollaborator] = useState({});

  useEffect(() => {
    if (props.event.id) fetchData();
  }, [props.event]);

  const fetchData = async () => {
    const res = await api.get("/api/event/permissions", {
      params: { eventId: props.event.id },
    });
    console.log(res);
    setData(res.data);
  };

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
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  const columns = [
    {
      title: "Collaborators",
      field: "Account.emailAddress",
    },
    {
      title: "Role",
      render: (rowData) => rowData.role,
    },
    {
      title: "Event Details",
      render: (rowData) => (
        <Checkbox
          checked={rowData.eventDetails}
          name="eventDetails"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
        />
      ),
    },
    {
      title: "Design",
      render: (rowData) => (
        <Checkbox
          checked={rowData.design}
          name="design"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
        />
      ),
    },
    {
      title: "Communication",
      render: (rowData) => (
        <Checkbox
          checked={rowData.communication}
          name="communication"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
        />
      ),
    },
    {
      title: "Registration",
      render: (rowData) => (
        <Checkbox
          checked={rowData.registration}
          name="registration"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
        />
      ),
    },
    {
      title: "Polls",
      render: (rowData) => (
        <Checkbox
          checked={rowData.polls}
          name="polls"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
        />
      ),
    },
    {
      title: "Analytics",
      render: (rowData) => (
        <Checkbox
          checked={rowData.analytics}
          name="analytics"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
        />
      ),
    },
    {
      title: "Messaging",
      render: (rowData) => (
        <Checkbox
          checked={rowData.messaging}
          name="messaging"
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

  const actions = [
    {
      icon: Edit,
      tooltip: "Edit collaborator",
      onClick: (event, rowData) => {
        console.log(rowData);
        setCollaborator(rowData);
        setOpenEditor(true);
      },
    },

    {
      icon: () => <TableActionButton label="Add collaborator" type="add" />,
      isFreeAction: true,
      onClick: (event) => {
        //handleAdd();
      },
    },
  ];

  const handleCloseEditor = () => {
    setOpenEditor(false);
  };

  const handleSubmitEditor = async () => {
    setOpenEditor(false);
  };

  const handleChangeCheckbox = async (event, rowData) => {
    // update the checkbox in the database
    const res = await api.put("/api/event/permissions", {
      type: event.target.name,
      checked: event.target.checked,
      accountId: rowData.id,
      eventId: props.event.id,
    });
    await fetchData();
  };

  return (
    <div className="shadow-border container-width">
      <Modal1
        open={openEditor}
        onClose={handleCloseEditor}
        title="Edit collaborator"
        content={<div>hola</div>}
      />
      <NavBar3
        displaySideNav="true"
        highlight="communication"
        content={
          <div>
            <MaterialTable
              title=""
              columns={columns}
              actions={actions}
              data={data}
              options={options}
              icons={tableIcons}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
            />
          </div>
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { email: state.email, event: state.event };
};

export default connect(mapStateToProps, actions)(Permissions);
