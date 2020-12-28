import React, { forwardRef, useState } from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import { withRouter } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

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
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import RestorePage from "@material-ui/icons/RestorePage";

import * as actions from "../actions";
import AlertModal from "./AlertModal";
import { statusOptions } from "../model/enums";

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

const BillingHistoryTable = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [actionRowId, setActionRowId] = useState(null);
  const [textInputLabel, setTextInputLabel] = useState("");
  const [onContinueAction, setOnContinueAction] = useState("");

  const data = props.eventList
    .filter((event) => {
      const startDate = new Date(event.start_date);
      const today = new Date();
      if (event.status === statusOptions.DELETED && props.tab === "deleted") {
        return true;
      } else if (
        event.status != statusOptions.DELETED &&
        startDate >= today &&
        props.tab === "upcoming"
      ) {
        return true;
      } else if (
        event.status != statusOptions.DELETED &&
        startDate < today &&
        props.tab === "past"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .map((event) => {
      const eventDate = new Date(event.start_date);
      return {
        id: event.id,
        name: event.title,
        date: eventDate.toLocaleString("en-us", {
          timeZoneName: "short",
          timeZone: event.time_zone,
        }),
        status: event.status.charAt(0).toUpperCase() + event.status.slice(1),
      };
    });

  const columns = [
    {
      title: "Date",
      field: "date",
    },
    {
      title: "Amount",
      field: "amount",
    },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "Status",
      field: "status",
    },
  ];

  const options = {
    showTitle: false,
    actionsColumnIndex: -1,

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

  const tableActions = [
    {
      icon: Edit,
      tooltip: "Edit Event",
      onClick: async (event, rowData) => {
        // Set this event as the current event
        const res = await props.setCurrentEvent(rowData.id);

        // fetch the new event
        props.setLoaded(false);
        await props.fetchEvent();
        props.setLoaded(true);

        props.history.push("/design");
      },
    },
    {
      icon: LibraryAdd,
      tooltip: "Duplicate Event",
      onClick: async (event, rowData) => {
        setActionRowId(rowData.id);
        setModalText(
          "Please enter a new unique subdomain link for this event. Please use only lower case letters, numbers and dashes (-)"
        );
        setTextInputLabel("New Link");
        setOnContinueAction("duplicate");
        setOpenModal(true);
      },
    },
    {
      icon: DeleteOutline,
      tooltip: "Delete Event",
      onClick: async (event, rowData) => {
        setActionRowId(rowData.id);
        setModalText("Are you sure you want to delete this event?");
        setTextInputLabel("");
        setOnContinueAction("delete");
        setOpenModal(true);
      },
    },
  ];

  const deletedActions = [
    {
      icon: RestorePage,
      tooltip: "Restore Event",
      onClick: async (event, rowData) => {
        await props.restoreEvent(rowData.id);
        props.setLoaded(false);
        await props.fetchEventList();
        props.setLoaded(true);
      },
    },
  ];

  const closeModal = () => {
    setOpenModal(false);
  };

  const onContinue = async (input) => {
    closeModal();

    if (onContinueAction == "delete") {
      await props.deleteEvent(actionRowId);
    }
    if (onContinueAction == "duplicate") {
      const res = await props.isLinkAvailable(input);
      if (res) {
        await props.duplicateEvent(actionRowId, input);
      } else {
        setModalText(
          "This subdomain link is not available. Please select a different link. Please use only lower case letters, numbers and dashes (-)"
        );
        setTextInputLabel("link");
        setOnContinueAction("duplicate");
        setOpenModal(true);

        return null;
      }
    }
    props.setLoaded(false);
    await props.fetchEventList();
    props.setLoaded(true);
  };

  if (props.settings.loaded) {
    return (
      <div>
        <AlertModal
          open={openModal}
          onClose={closeModal}
          onContinue={onContinue}
          text={modalText}
          closeText="Cancel"
          continueText="Continue"
          textInputLabel={textInputLabel}
        />
        <MaterialTable
          title="Billing History"
          data={data}
          columns={columns}
          options={options}
          icons={tableIcons}
          actions={props.tab === "deleted" ? deletedActions : tableActions}
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          key={props.eventList}
        />
      </div>
    );
  } else {
    return (
      <div style={{ width: "630px", padding: "50px" }}>
        <CircularProgress />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return { eventList: state.eventList, settings: state.settings };
};

export default connect(mapStateToProps, actions)(withRouter(BillingHistoryTable));
