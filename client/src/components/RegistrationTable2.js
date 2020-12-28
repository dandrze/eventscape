import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import { connect } from "react-redux";
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
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";

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

const RegistrationTable2 = (props) => {
  const [state, setState] = useState({
    columns: [],
    data: [],
  });

  const tableActions = [
    {
      icon: Edit,
      tooltip: "Edit Event",
      onClick: async (event, rowData) => {
        const rowId = rowData.id;
        const firstName = rowData.firstName;
        const lastName = rowData.lastName;
        const email = rowData.emailAddress;
        var values;

        for (var row of props.registration.data) {
          if (row.id == rowId) {
            values = row.values;
          }
        }

        props.handleEditReg(rowId, { firstName, lastName, email }, values);
      },
    },
  ];

  const inputElements = [
    "Dropdown",
    "Checkboxes",
    "RadioButtons",
    "TextInput",
    "NumberInput",
    "DatePicker",
  ];

  // loads the registration data into the state
  useEffect(() => {
    // map the column data from the react-form-builder2 format to the material format
    const columns = props.registration.columns
      .map((column) => {
        if (inputElements.includes(column.element)) {
          return { title: column.label, field: column.field_name };
        }
      })
      .filter(Boolean);

    columns.unshift({ title: "Email Address", field: "emailAddress" });
    columns.unshift({ title: "Last Name", field: "lastName" });
    columns.unshift({ title: "First Name", field: "firstName" });

    // empty data list to be populated in the loop below
    const data = [];

    // map the registration data from the react-form-builder2 format to the material format
    for (var row of props.registration.data) {
      var rowObject = { event: props.event.id, id: row.id };

      for (var value of row.values) {
        //formbuilder prefixes the name with the field type, so we'll extract this out to determine what type it is
        var columnType = value.name.split("_")[0];

        if (columnType == "checkboxes" || columnType == "radiobuttons") {
          var valueMap;
          //populate the valueMap which we use to "translate" the checkbox and radio button values from the form ids to the users text
          for (var column of props.registration.columns) {
            if (column.field_name === value.name) {
              valueMap = column.options;
            }
          }
          if (valueMap) {
            var mappedValue = value.value.map((v) => {
              for (var i = 0; i < valueMap.length; i++) {
                if (valueMap[i].key == v) {
                  return valueMap[i].text + "; ";
                }
              }
            });
          }

          // material table format is { [column field_name]: [value]}
          rowObject = { ...rowObject, [value.name]: mappedValue };
        } else {
          // for all other field types, we can just read the value directly
          // material table format is { [column field_name]: [value]}
          rowObject = { ...rowObject, [value.name]: value.value };
        }
      }
      // add the email (not included in values) to row object
      rowObject = {
        ...rowObject,
        emailAddress: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
      };
      // add this new row object to the data list
      data.push(rowObject);
    }

    setState({ columns, data });
  }, [props.registration]);

  const options = {
    actionsColumnIndex: -1,
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
    <div className="shadow-border">
      <MaterialTable
        title="Registrations"
        columns={state.columns}
        data={state.data}
        options={options}
        icons={tableIcons}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        actions={tableActions}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              props.handleDeleteReg(oldData.id);
              resolve();
            }),
        }}
        localization={{
          body: {
            emptyDataSourceMessage: props.settings.loaded ? (
              "No Registrations Found"
            ) : (
              <CircularProgress />
            ),
          },
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    registration: state.registration,
    event: state.event,
    settings: state.settings,
  };
};

export default connect(mapStateToProps, actions)(RegistrationTable2);
