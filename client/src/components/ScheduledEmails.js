import React, { useEffect } from "react";
import { connect } from "react-redux";
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
import FoldingCube from "./FoldingCube";


import * as actions from "../actions";
import { recipientsOptions } from "../model/enums";
import TableActionButton from "./TableActionButton";

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

function ScheduledEmails(props) {
  const [data, setData] = React.useState([]);

  useEffect(() => {
    const formattedEmailList = props.email.map((email) => {
      // start with the event start date. Then modify if by adding the minutesFromEvent
      const sendDate = new Date(props.event.startDate);
      sendDate.setMinutes(sendDate.getMinutes() + email.minutesFromEvent);

      return {
        ...email,
        sendDate:
          email.recipients === recipientsOptions.NEW_REGISTRANTS
            ? " Upon Registration"
            : sendDate.toLocaleString("en-us", {
                timeZoneName: "short",
                timeZone: props.event.timeZone,
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                timeZoneName: "short",
              }),

        status: email.status.charAt(0).toUpperCase() + email.status.slice(1),
      };
    });
    setData(formattedEmailList);
  }, [props.email]);

  const columns = [
    {
      title: "Subject",
      field: "subject",
    },
    {
      title: "To",
      field: "recipients",
    },
    {
      title: "Scheduled Send",
      field: "sendDate",
      defaultSort: "asc",
    },
    {
      title: "Status",
      field: "status",
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
      tooltip: "Edit Email",
      onClick: (event, rowData) => {
        props.handleEdit(rowData);
      },
    },
    (rowData) => ({
      icon: LibraryAdd,
      tooltip: "Duplicate Email",
      onClick: (event, rowData) => {
        props.handleDuplicate(rowData);
      },
      disabled: rowData.recipients === recipientsOptions.NEW_REGISTRANTS,
    }),
    {
      icon: () => <TableActionButton label="New Email" type="add" />,
      isFreeAction: true,
      onClick: (event) => {
        props.handleAdd();
      },
    },
  ];

  return (
    <div className="shadow-border container-width">
      <MaterialTable
        title="Scheduled Emails"
        columns={columns}
        data={data}
        options={options}
        icons={tableIcons}
        actions={actions}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        editable={{
          isDeletable: (rowData) =>
            rowData.recipients != recipientsOptions.NEW_REGISTRANTS,
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              if (oldData.recipients == recipientsOptions.NEW_REGISTRANTS) {
                toast.info(
                  "The registration confirmation email cannot be duplicated"
                );
              } else {
                props.handleDelete(oldData.id);
              }
              resolve();
            }),
        }}
        localization={{
          body: {
            emptyDataSourceMessage: props.settings.loaded ? (
              "No Emails Found"
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

export default connect(mapStateToProps, actions)(ScheduledEmails);
