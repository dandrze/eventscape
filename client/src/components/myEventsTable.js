import React from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "../icons/menu.svg";
import { format } from "date-fns-tz";

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
	const data = props.eventList.map((event) => {
		console.log(typeof event.start_date);
		return {
			eventName: event.title,
			eventDate: event.start_date,
			status: "placeholder",
		};
	});

	const columns = [
		{
			title: "Event Name",
			field: "eventName",
		},
		{
			title: "Event Date",
			field: "eventDate",
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
			icon: () => <HandleEdit />,
		},
	];

	const HandleEdit = (event) => {
		const [anchorEl, setAnchorEl] = React.useState(null);

		const handleClick = (event) => {
			setAnchorEl(event.currentTarget);
		};

		const handleClose = () => {
			setAnchorEl(null);
		};

		return (
			<div>
				<Button
					aria-controls="simple-menu"
					aria-haspopup="true"
					onClick={handleClick}
				>
					<img src={MenuIcon} height="22px"></img>
				</Button>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem onClick={handleClose}>Dashboard</MenuItem>
					<MenuItem onClick={handleClose}>Duplicate</MenuItem>
					<MenuItem onClick={handleClose}>Delete</MenuItem>
				</Menu>
			</div>
		);
	};

	return (
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
		/>
	);
};

const mapStateToProps = (state) => {
	return { eventList: state.eventList };
};

export default connect(mapStateToProps)(Table);
