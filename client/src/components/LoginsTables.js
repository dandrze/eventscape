import React from 'react';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import { Paper } from '@material-ui/core';

/*Material-Table Icons*/
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

export default function LoginsTable() {
  const [state, setState] = React.useState({
    columns: [
        {
            title: "First Name",
            field: "fName",
          },
          {
            title: "Last Name",
            field: "lName",
          },
          {
            title: "Email",
            field: "email",
          },
          {
            title: "First Login",
            field: "fLogin",
          },
          {
            title: "Last Logout",
            field: "lLogout",
          },
          {
            title: "Time Viewed",
            field: "timeViewed",
          },
    ],
    data: [
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
        { fName: "First", lName: "Last", email: "email@email.com", fLogin: "yyyy-mm-dd hh:mm", lLogout: "yyyy-mm-dd hh:mm", timeViewed: "hh:mm" },
    ],
  });
  const options = {
    actionsColumnIndex: -1,
    exportButton: true,
    exportAllData: true,
    showTitle: false,
    
    headerStyle: {
      backgroundColor: '#F0F1F4',
      color: 'black',
      fontFamily: 'Roboto, Helvetica Neue, Ariel, sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      margin: '30px'
    },

    cellStyle: {
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Roboto, Helvetica Neue, Ariel, sans-serif',
        fontSize: '14px',
        fontWeight: '300',
    }
  };

  return (
    <div className="shadow-border">
    <MaterialTable
      title="Logins"
      columns={state.columns}
      data={state.data}
      options={options}
      icons={tableIcons}
      components={{
        Container: props => <Paper {...props} elevation={0}/>
      }}
    />
    </div>
  );
}