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

import * as actions from "../actions";
import AlertModal from "./AlertModal";

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

const Table = (props) => {
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");
	const [rowDeleteId, setRowDeleteId] = useState(null);
	const data = props.eventList
		.filter((event) => {
			const startDate = new Date(event.start_date);
			const today = new Date();
			if (
				(startDate >= today && props.isUpcoming) ||
				(startDate < today && !props.isUpcoming)
			) {
				return true;
			}
		})
		.map((event) => {
			const eventDate = new Date(event.start_date);
			return {
				id: event.id,
				name: event.title,
				date: eventDate.toLocaleString(),
				status: event.is_live ? "Live" : "Draft",
			};
		});

	const columns = [
		{
			title: "Event Name",
			field: "name",
		},
		{
			title: "Event Date",
			field: "date",
		},
		{
			title: "Status",
			field: "status",
		},
		{
			title: "",
			field: "edit",
		},
	];

	const options = {
		showTitle: false,
		actionsColumnIndex: -1,

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
			tooltip: "Edit Event",
			onClick: async (event, rowData) => {
				// Set this event as the current event
				const res = await props.setCurrentEvent(rowData.id);

				// fetch the new event
				await props.fetchEvent();

				props.history.push("/design");
			},
		},
		{
			icon: LibraryAdd,
			tooltip: "Duplicate Event",
			onClick: async (event, rowData) => {
				await props.duplicateEvent(rowData.id);
				props.fetchEventList();
				//add stuff here
			},
		},
		{
			icon: DeleteOutline,
			tooltip: "Delete Event",
			onClick: async (event, rowData) => {
				setRowDeleteId(rowData.id);
				setModalText("Are you sure you want to delete this event?");
				setOpenModal(true);
			},
		},
	];

	const closeModal = () => {
		setOpenModal(false);
	};

	const deleteRow = async () => {
		await props.deleteEvent(rowDeleteId);
		props.fetchEventList();
	};

	if (data.length > 0) {
		return (
			<div>
				<AlertModal
					open={openModal}
					onClose={closeModal}
					onContinue={() => {
						deleteRow();
						closeModal();
					}}
					text={modalText}
					closeText="Cancel"
					continueText="Continue"
				/>
				<MaterialTable
					title="Employee Details"
					data={data}
					columns={columns}
					options={options}
					icons={tableIcons}
					actions={actions}
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
	return { eventList: state.eventList };
};

export default connect(mapStateToProps, actions)(withRouter(Table));
