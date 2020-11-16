import React from "react";
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

export default function ScheduledEmails() {
	const [state, setState] = React.useState({
		columns: [
			{
				title: "Subject",
				field: "subject",
			},
			{
				title: "To",
				field: "to",
			},
			{
				title: "Scheduled Send",
				field: "scheduledSend",
			},
			{
				title: "Event Start Time Minus",
				field: "timeMinus",
			},
			{
				title: "Status",
				field: "status",
			},
		],
		data: [
			{
				subject: "You are Invited To {Event_Name}",
				to: "Email List",
				scheduledSend: "yyyy-mm-dd hh:mm",
				timeMinus: "7 Days, 0 Hours",
				status: "Draft",
			},
			{
				subject: "Thank You for Registering for {Event_Name}",
				to: "New Registrants",
				scheduledSend: "Upon Registration",
				timeMinus: "",
				status: "Active",
			},
			{
				subject: "Reminder: {Event_Name} Tomorrow",
				to: "All Registrants",
				scheduledSend: "yyyy-mm-dd hh:mm",
				timeMinus: "1 Days, 0 Hours",
				status: "Draft",
			},
			{
				subject: "Reminder: {Event_Name} in One Hour",
				to: "All Registrants",
				scheduledSend: "yyyy-mm-dd hh:mm",
				timeMinus: "0 Days, 1 Hour",
				status: "Active",
			},
			{
				subject: "Thank You for Attending {Event_Name}",
				to: "All Registrants",
				scheduledSend: "yyyy-mm-dd hh:mm",
				timeMinus: "-1 Days, 0 Hour",
				status: "Draft",
			},
		],
	});
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
				//window.open('./CommunicationEditor', "_self");
			},
		},
		{
			icon: LibraryAdd,
			tooltip: "Duplicate Email",
			onClick: (event, rowData) => {
				//add stuff here
			},
		},
	];

	return (
		<div className="shadow-border container-width">
			<MaterialTable
				title="Scheduled Emails"
				columns={state.columns}
				data={state.data}
				options={options}
				icons={tableIcons}
				actions={actions}
				components={{
					Container: (props) => <Paper {...props} elevation={0} />,
				}}
				editable={{
					onRowAdd: (newData) =>
						new Promise((resolve) => {
							setTimeout(() => {
								resolve();
								setState((prevState) => {
									const data = [...prevState.data];
									data.push(newData);
									return { ...prevState, data };
								});
							}, 600);
						}),
					/*onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),*/

					onRowDelete: (oldData) =>
						new Promise((resolve) => {
							setTimeout(() => {
								resolve();
								setState((prevState) => {
									const data = [...prevState.data];
									data.splice(data.indexOf(oldData), 1);
									return { ...prevState, data };
								});
							}, 600);
						}),
				}}
			/>
		</div>
	);
}
