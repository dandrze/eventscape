import React, { useEffect, useState, forwardRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import NavBar3 from "../components/navBar3.js";
import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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
import FoldingCube from "../components/FoldingCube";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import * as actions from "../actions";
import api from "../api/server";
import Modal1 from "../components/Modal1";
import TableActionButton from "../components/TableActionButton";
import AccessDeniedScreen from "../components/AccessDeniedScreen.js";

import { isValidEmailFormat } from "../hooks/validation";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  dropDown: {
    width: "100%",
  },
}));

const Permissions = ({ event, user }) => {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState(null);
  const [transferStatus, setTransferStatus] = useState("Not Started");
  const [newCollaboratorEmailAddress, setNewCollaboratorEmailAddress] =
    useState("");
  const [newEmailErrorText, setNewEmailErrorText] = useState("");

  useEffect(() => {
    if (event.id) fetchData();
  }, [event]);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/event/permissions", {
        params: { eventId: event.id },
      });
      setData(res.data);
    } catch (err) {
      toast.error(err.response.data.message);
    }
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
      defaultSort: "desc",
      field: "role",
    },
    {
      title: "Status",
      customSort: (a, b) =>
        a.Account.registrationComplete - b.Account.registrationComplete,
      render: (rowData) =>
        rowData.Account.registrationComplete
          ? "Active"
          : "Pending Account Creation",
    },
    {
      title: "Event Details",
      customSort: (a, b) => a.eventDetails - b.eventDetails,
      render: (rowData) => (
        <Checkbox
          checked={rowData.eventDetails}
          name="eventDetails"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
          disabled={rowData.role === "owner"}
        />
      ),
    },
    {
      title: "Design",
      customSort: (a, b) => a.design - b.design,
      render: (rowData) => (
        <Checkbox
          checked={rowData.design}
          name="design"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
          disabled={rowData.role === "owner"}
        />
      ),
    },
    {
      title: "Communication",
      customSort: (a, b) => a.communication - b.communication,
      render: (rowData) => (
        <Checkbox
          checked={rowData.communication}
          name="communication"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
          disabled={rowData.role === "owner"}
        />
      ),
    },
    {
      title: "Registration",
      customSort: (a, b) => a.registration - b.registration,
      render: (rowData) => (
        <Checkbox
          checked={rowData.registration}
          name="registration"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
          disabled={rowData.role === "owner"}
        />
      ),
    },
    {
      title: "Polls",
      customSort: (a, b) => a.polls - b.polls,
      render: (rowData) => (
        <Checkbox
          checked={rowData.polls}
          name="polls"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
          disabled={rowData.role === "owner"}
        />
      ),
    },
    {
      title: "Analytics",
      customSort: (a, b) => a.analytics - b.analytics,
      render: (rowData) => (
        <Checkbox
          checked={rowData.analytics}
          name="analytics"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
          disabled={rowData.role === "owner"}
        />
      ),
    },
    {
      title: "Messaging",
      customSort: (a, b) => a.messaging - b.messaging,
      render: (rowData) => (
        <Checkbox
          checked={rowData.messaging}
          name="messaging"
          onChange={(event) => handleChangeCheckbox(event, rowData)}
          disabled={rowData.role === "owner"}
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
      icon: () => <TableActionButton label="Add collaborator" type="add" />,
      isFreeAction: true,
      onClick: (event) => {
        setOpenAddModal(true);
      },
    },
  ];

  const handleChangeCheckbox = async (event, rowData) => {
    // update the checkbox in the database
    try {
      const res = await api.put("/api/event/permissions", {
        type: event.target.name,
        checked: event.target.checked,
        permissionId: rowData.id,
      });
      await fetchData();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleAddCollaborator = async () => {
    if (!isValidEmailFormat(newCollaboratorEmailAddress)) {
      return setNewEmailErrorText("Please enter a valid email address.");
    } else {
      setNewEmailErrorText("");
    }
    try {
      const res = await api.post("/api/event/permissions", {
        eventId: event.id,
        emailAddress: newCollaboratorEmailAddress,
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
    setNewCollaboratorEmailAddress("");
    setOpenAddModal(false);
    await fetchData();
  };

  const handleDeleteCollaborator = async (permissionId) => {
    try {
      const res = await api.delete("/api/event/permissions", {
        params: { permissionId },
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
    setOpenAddModal(false);
    await fetchData();
  };

  const handleChangeNewCollaboratorEmailAddress = (event) => {
    setNewCollaboratorEmailAddress(event.target.value.toLowerCase());
  };

  const handleClickTransfer = () => {
    setOpenTransferModal(true);
  };

  const handleChangeTransferTarget = (event) => {
    setTransferTarget(event.target.value);
  };

  const handleTransferOwnership = async () => {
    if (transferTarget) {
      setTransferStatus("Loading");
      const res = await api.post("/api/event/transfer-ownership", {
        eventId: event.id,
        oldAccountId: user.id,
        newAccountId: transferTarget.AccountId,
      });

      setTransferStatus("Complete");
    }
  };

  const handleConfirmTransferOwnership = () => {
    if (transferTarget) {
      setTransferStatus("Confirm");
    }
  };

  return (
    <div>
      <Modal1
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title="New collaborator"
        content={
          <div style={{ width: "400px" }}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                label="Email Address"
                variant="outlined"
                value={newCollaboratorEmailAddress}
                onChange={handleChangeNewCollaboratorEmailAddress}
              />
              <div className="errorMessage">{newEmailErrorText}</div>
            </FormControl>
            <div style={{ height: "40px" }} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCollaborator}
              class="Button1"
              style={{ width: "150px", alignSelf: "flex-end" }}
            >
              Save
            </Button>
          </div>
        }
      />
      <Modal1
        open={openTransferModal}
        onClose={() => setOpenTransferModal(false)}
        title="Transfer Ownership"
        content={
          transferStatus === "Not Started" ? (
            <div style={{ width: "400px" }}>
              <Select
                variant="outlined"
                value={transferTarget}
                onChange={handleChangeTransferTarget}
                className={classes.dropDown}
              >
                {data.map((collaborator, index) => {
                  // only display collaborators that are not the current user
                  if (collaborator.Account.id !== user.id) {
                    return (
                      <MenuItem value={collaborator}>
                        {collaborator.Account.emailAddress}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
              <div style={{ height: "40px" }} />
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmTransferOwnership}
                class="Button1"
                style={{ width: "150px", alignSelf: "flex-end" }}
              >
                Transfer
              </Button>
            </div>
          ) : transferStatus === "Loading" ? (
            <FoldingCube />
          ) : transferStatus === "Confirm" ? (
            <div style={{ width: "400px" }}>
              <p>
                Are you sure you want to transfer ownership of this event? This
                cannot be reversed by your account. You will need to ask the new
                owner to transfer ownership back to you.
              </p>
              <div style={{ height: "40px" }} />
              <a href="/">
                <Button
                  variant="contained"
                  color="primary"
                  class="Button1"
                  style={{ width: "150px", alignSelf: "flex-end" }}
                  onClick={handleTransferOwnership}
                >
                  Confirm Transfer
                </Button>
              </a>
            </div>
          ) : transferStatus === "Complete" ? (
            <div style={{ width: "400px" }}>
              <p>Your transfer is complete.</p>
              <div style={{ height: "40px" }} />
              <a href="/">
                <Button
                  variant="contained"
                  color="primary"
                  class="Button1"
                  style={{ width: "150px", alignSelf: "flex-end" }}
                >
                  Finish
                </Button>
              </a>
            </div>
          ) : (
            <p>Unexpected error. Please close the popup and try again.</p>
          )
        }
      />
      <NavBar3
        displaySideNav="true"
        highlight="permissions"
        content={
          // only display content once the event is loaded
          event.id ? (
            event.permissions?.role === "owner" ? (
              <div className="container-width shadow-border">
                <div className="top-button-bar">
                  <button className="Button1" onClick={handleClickTransfer}>
                    Transfer Ownership
                  </button>
                </div>
                <MaterialTable
                  title=""
                  columns={columns}
                  actions={actions}
                  data={data}
                  options={options}
                  icons={tableIcons}
                  editable={{
                    isDeletable: (rowData) => rowData.AccountId != user.id,
                    onRowDelete: (oldData) =>
                      new Promise(async (resolve) => {
                        await handleDeleteCollaborator(oldData.id);
                        resolve();
                      }),
                  }}
                  components={{
                    Container: (props) => <Paper {...props} elevation={0} />,
                  }}
                />
              </div>
            ) : (
              <AccessDeniedScreen message="You must be an event owner to access permissions." />
            )
          ) : null
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event, user: state.user };
};

export default connect(mapStateToProps, actions)(Permissions);
