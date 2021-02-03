import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
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

//put email list table in modal:

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: "0px",
  },
}));

const EmailList = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "First Name",
      field: "firstName",
    },
    {
      title: "Last Name",
      field: "lastName",
    },
    {
      title: "Email",
      field: "email",
    },
  ];

  const fetchData = async () => {
    const res = await props.fetchEmailList(props.emailId);
    setData(res);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const options = {
    actionsColumnIndex: -1,
    exportButton: true,
    exportAllData: true,

    headerStyle: {
      backgroundColor: "#F0F1F4",
      color: "black",
      fontFamily: "Helvetica, Ariel, sans-serif",
      fontSize: "14px",
      fontWeight: "bold",
      margin: "30px",
      minWidth: "120px",
    },

    cellStyle: {
      backgroundColor: "white",
      color: "black",
      fontFamily: "Helvetica, Ariel, sans-serif",
      fontSize: "14px",
      fontWeight: "normal",
    },
  };

  return (
    <div>
      <button className="Button2" onClick={handleOpen}>
        Edit Email List
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div id="emailListHeader">
              <h2 id="emailListTitle">Email List</h2>
              <button className="Button1" id="uploadCSV">
                Upload CSV
              </button>
              <br></br>
            </div>
            <MaterialTable
              title=""
              columns={columns}
              data={data}
              options={options}
              icons={tableIcons}
              editable={{
                onRowAdd: (newData) =>
                  new Promise(async (resolve) => {
                    await props.addToEmailList(newData, props.emailId);
                    fetchData();
                    resolve();
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise(async (resolve) => {
                    await props.updateFromEmailList(newData, oldData.id);
                    fetchData();
                    resolve();
                  }),
                onRowDelete: (oldData) =>
                  new Promise(async (resolve) => {
                    await props.deleteFromEmailList(oldData.id);
                    fetchData();
                    resolve();
                  }),
              }}
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default connect(null, actions)(EmailList);
