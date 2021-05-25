import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import { Paper, Tooltip } from "@material-ui/core";
import { toast } from "react-toastify";
import Modal1 from "./Modal1";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import AlertModal from "./AlertModal";

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
import FoldingCube from "./FoldingCube";


import * as actions from "../actions";
import api from "../api/server";
import PlanSliders from "./PlanSliders";

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

const BillingTable = ({ event, plan, handleClickUpdate }) => {
  const [data, setData] = useState([
    {
      description: null,
      amount: null,
      actions: null,
    },
  ]);

  useEffect(() => {
    fetchData();
  }, [plan]);

  const fetchData = async () => {
    const res = await api.get("/api/billing/invoice", {
      params: { eventId: event.id },
    });

    const invoice = res.data;
    var totalCost = 0;

    const lineItems = invoice.InvoiceLineItems.map((lineItem) => {
      if (lineItem.type === "plan") {
        const totalPlanCost =
          lineItem.Plan.PlanType.fixedPrice +
          lineItem.Plan.viewers *
            lineItem.Plan.streamingTime *
            lineItem.Plan.PlanType.pricePerViewerHour;

        totalCost += totalPlanCost;

        return {
          description: (
            <div>
              {lineItem.Plan.PlanType.name} ({lineItem.Plan.viewers} viewers,{" "}
              {lineItem.Plan.streamingTime}h)
              <br></br>
              <br></br>
              <span className="billing-subtext">
                *additional viewers or time will be billed at $
                {lineItem.Plan.PlanType.pricePerViewerHour} per viewer per hour.
              </span>
            </div>
          ),
          amount: `$${totalPlanCost}`,
          actions: (
            <button className="Button1" onClick={handleClickUpdate}>
              Change Plan
            </button>
          ),
        };
      } else {
        const totalCustomCost =
          lineItem.CustomLineItem.cost * lineItem.CustomLineItem.quantity;

        totalCost += totalCustomCost;
        return {
          description: `${lineItem.CustomLineItem.description} (${lineItem.CustomLineItem.quantity} ${lineItem.CustomLineItem.unitType})`,
          amount: `$${totalCustomCost}`,
        };
      }
    });

    const totalLine = [
      {
        description: <strong>TOTAL</strong>,
        amount: <strong>${totalCost}</strong>,
        actions: "",
      },
    ];

    setData(lineItems.concat(totalLine));
  };

  const columns = [
    { field: "id", defaultSort: "asc", hidden: true },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "Amount",
      field: "amount",
    },
    {
      title: "Actions",
      field: "actions",
    },
  ];

  const options = {
    actionsColumnIndex: -1,
    search: false,
    paging: false,
    toolbar: false,
    header: false,

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
    <div>
      <MaterialTable
        title=""
        columns={columns}
        data={data}
        options={options}
        icons={tableIcons}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
      />
    </div>
  );
};

/*const PricingMatrix = (props) => {


  return (
    <table>
      <tr>
        <td></td>
        <td></td>
        <td colSpan="7"><p style={{ textAlign: "center"}}>Event Length</p></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td><div className="matrix-header matrix-cell-style">1 h</div></td>
        <td><div className="matrix-header matrix-cell-style">2 h</div></td>
        <td><div className="matrix-header matrix-cell-style">3 h</div></td>
        <td><div className="matrix-header matrix-cell-style">4 h</div></td>
        <td><div className="matrix-header matrix-cell-style">4-6 h</div></td>
        <td><div className="matrix-header matrix-cell-style">6-8 h</div></td>
        <td><div className="matrix-header matrix-cell-style">8+ h</div></td>
      </tr>
      <tr>
        <td rowSpan="7"><p className="rotate90" style={{ width: '70px' }}>Unique Viewers</p></td>
        <td><div className="matrix-row-label matrix-cell-style">500</div></td>
        <td><MatrixBlock price={375} viewers={500} hours={1} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={450} viewers={500} hours={2} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={525} viewers={500} hours={3} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={600} viewers={500} hours={4} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={750} viewers={500} hours={6} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={900} viewers={500} hours={8} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td rowSpan="6"><div className="matrix-cell-style" style={{ backgroundColor: "beige", width: '100px', height: '620px', lineHeight: '620px' }}>Contact Us</div></td>
      </tr>
      <tr>
        <td><div className="matrix-row-label matrix-cell-style">1000</div></td>
        <td><MatrixBlock price={450} viewers={1000} hours={1} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={600} viewers={1000} hours={2} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={750} viewers={1000} hours={3} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={900} viewers={1000} hours={4} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={1200} viewers={1000} hours={6} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={1500} viewers={1000} hours={8} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
      </tr>
      <tr>
        <td><div className="matrix-row-label matrix-cell-style">1500</div></td>
        <td><MatrixBlock price={525} viewers={1500} hours={1} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={750} viewers={1500} hours={2} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={975} viewers={1500} hours={3} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={1200} viewers={1500} hours={4} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={1650} viewers={1500} hours={6} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={2100} viewers={1500} hours={8} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
      </tr>
      <tr>
        <td><div className="matrix-row-label matrix-cell-style">2000</div></td>
        <td><MatrixBlock price={600} viewers={2000} hours={1} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={900} viewers={2000} hours={2} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={1200} viewers={2000} hours={3} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={1500} viewers={2000} hours={4} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={2100} viewers={2000} hours={6} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={2700} viewers={2000} hours={8} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
      </tr>
      <tr>
        <td><div className="matrix-row-label matrix-cell-style">3000</div></td>
        <td><MatrixBlock price={750} viewers={3000} hours={1} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={1200} viewers={3000} hours={2} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={1650} viewers={3000} hours={3} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={2100} viewers={3000} hours={4} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={3000} viewers={3000} hours={6} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={3900} viewers={3000} hours={8} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
      </tr>
      <tr>
        <td><div className="matrix-row-label matrix-cell-style">5000</div></td>
        <td><MatrixBlock price={1050} viewers={5000} hours={1} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={1800} viewers={5000} hours={2} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={2550} viewers={5000} hours={3} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={3300} viewers={5000} hours={4} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={4800} viewers={5000} hours={6} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
        <td><MatrixBlock price={6300} viewers={5000} hours={8} onClickMatrixBlock={props.onClickMatrixBlock}/></td>
      </tr>
      <tr>
        <td><div className="matrix-row-label matrix-cell-style">5000+</div></td>
        <td colSpan="6"><div className="matrix-cell-style" style={{ backgroundColor: "beige", height: '100px', lineHeight: '100px', width: '100%' }}>Contact Us</div></td>
      </tr>
    </table>
  )
};

const MatrixBlock = (props) => {

  return (
    <Tooltip title={'Click to select ' + props.viewers + ' viewers for ' + props.hours + ' hour(s)' }>
      <div className='matrix-block matrix-cell-style' onClick={props.onClickMatrixBlock}>{'$' + props.price}</div>
    </Tooltip>
  )
};
*/

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(BillingTable);
