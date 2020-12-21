import React, { useEffect } from "react";
import { connect } from "react-redux";
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
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";
import { recipientsOptions } from "../model/enums";

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

  console.log(props.email);

  useEffect(() => {
    const formattedEmailList = props.email.map((email) => {
      // start with the event start date. Then modify if by adding the minutes_from_event
      const sendDate = new Date(props.event.start_date);
      sendDate.setMinutes(sendDate.getMinutes() + email.minutes_from_event);

      return {
        ...email,
        send_date:
          email.recipients === recipientsOptions.NEW_REGISTRANTS
            ? "Upon Registration"
            : sendDate.toLocaleString("en-us", {
                timeZoneName: "short",
                timeZone: props.event.time_zone,
              }),

        status: email.status.charAt(0).toUpperCase() + email.status.slice(1),
      };
    });
    setData(formattedEmailList);
    console.log(formattedEmailList);
  }, [props.email]);

  const columns = [
    {
      title: "Subject",
      field: "subject",
    },
    {
      title: "From",
      field: "from_name",
    },
    {
      title: "To",
      field: "recipients",
    },
    {
      title: "Scheduled Send",
      field: "send_date",
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
      fontFamily: "San Francisco, Helvetica, Ariel, sans-serif",
      fontSize: "14px",
      fontWeight: "bold",
      margin: "30px",
    },

    cellStyle: {
      backgroundColor: "white",
      color: "black",
      fontFamily: "San Francisco, Helvetica, Ariel, sans-serif",
      fontSize: "14px",
      fontWeight: "normal",
    },
  };

  const actions = [
    {
      icon: Edit,
      tooltip: "Edit Email",
      onClick: (event, rowData) => {
        console.log(rowData);
        props.handleEdit(rowData);
      },
    },
    {
      icon: LibraryAdd,
      tooltip: "Duplicate Email",
      onClick: (event, rowData) => {
        props.handleDuplicate(rowData);
      },
    },
    {
      icon: AddBox,
      tooltip: "Add Email",
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
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              props.handleDelete(oldData.id);
              resolve();
            }),
        }}
        localization={{
          body: {
            emptyDataSourceMessage: props.settings.loaded ? (
              "No Emails Found"
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

export default connect(mapStateToProps, actions)(ScheduledEmails);
