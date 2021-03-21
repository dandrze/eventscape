import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import { Paper, Tooltip } from "@material-ui/core";
import { toast } from "react-toastify";
import Modal1 from "./Modal1";
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import AlertModal from './AlertModal';


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
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";
import api from "../api/server";
import { props } from "bluebird";

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

const BillingTable = (props) => {
  const [openPricingMatrix, setOpenPricingMatrix] = React.useState(false);

  const handleClosePricingMatrix = () => {
    setOpenPricingMatrix(false);
  };

  const handleOpenPricingMatrix = () => {
    setOpenPricingMatrix(true);
  };

  const handleClickMatrixBlock = () => {
    setOpenPricingMatrix(false);
  };



  const [data, setData] = useState([
    { 
      description: 
        <div>
          Pro (1000 viewers, 2h)
          <br></br>
          <br></br>
          <span className="billing-subtext">
            *additional viewers or time will be billed at $.01 per viewer per minute.
          </span>
        </div>, 
      amount: '$832.00', 
      actions: 
        <button 
          className='Button1' 
          onClick={handleOpenPricingMatrix}
        >
          Change Plan
        </button>
    },
    { description: 'Web Development (4h)', amount: '$500.00', actions: ''},
    { description: <strong>TOTAL</strong>, amount: <strong>$1332.00</strong>, actions: ''}
  ]);

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
      <Modal1
        open={openPricingMatrix}
        onClose={handleClosePricingMatrix}
        content={<Sliders onClose={handleClosePricingMatrix}/>}
      />
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






const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

const marksViewers = [
  {
    value: 500,
    //label: '500',
  },
  {
    value: 1000,
    //label: '1000',
  },
  {
    value: 1500,
    //label: '1500',
  },
  {
    value: 2000,
    //label: '2000',
  },
  {
    value: 3000,
    //label: '3000',
  },
  {
    value: 4000,
    //label: '4000',
  },
  {
    value: 5000,
    //label: '5000',
  },
  {
    value: 5500,
    //label: '5000',
  },
];

function valuetextViewers(value) {
  return `${value} Viewers`;
};

function valueLabelFormatViewers(value) {
  if (value <= 5000) {
    return value;
  } else {
    return '5k+'
  }
};

const marksTime = [
  {
    value: 1,
    //label: '1 h',
  },
  {
    value: 2,
    //label: '2 h',
  },
  {
    value: 3,
    //label: '3 h',
  },
  {
    value: 4,
    //label: '4 h',
  },
  {
    value: 6,
    //label: '6 h',
  },
  {
    value: 8,
    //label: '8 h',
  },
  {
    value: 9,
    //label: '8+ h',
  },
];

function valuetextTime(value) {
  return value;
};

function valueLabelFormatTime(value) {
  if (value <= 8) {
    return value + ' h';
  } else {
    return '8+ h'
  }
};










const Sliders = (props) => {
  const classes = useStyles();

  const [viewers, setViewers] = React.useState(
    500
  );

  const [streamingTime, setStreamingTime] = React.useState(
    1
  );

  const [essentialsAlertOpen, setEssentialsAlertOpen] = React.useState(false);

  const handleChangeViewers = (event, newValue) => {
    setViewers(newValue);
  };

  const handleChangeStreamingTime = (event, newValue) => {
    setStreamingTime(newValue);
  };

  const handleUpdatePlan = () => {
    props.onClose();
    // insert save to db here
  };

  const openEssentialsAlert = () => {
    setEssentialsAlertOpen(true);
  };

  const closeEssentialsAlert = () => {
    setEssentialsAlertOpen(false);
  };

  const handleCancelPro = () => {
    setEssentialsAlertOpen(false);
    props.onClose();
    // insert change db back to Essentials at $0
  };

  //Price Calculation:
  const fixedPrice = 250; // Fixed price per event. Covers support time and other costs.
  const variablePrice = 0.10 // Variable price per viewer per hour. Covers CDN streaming costs and other variable costs. 
  const Price = fixedPrice + (viewers * streamingTime * variablePrice); // Price formula
  const contactUs = (viewers > 5000) || (streamingTime > 8); // Contact us for events with over 5000 viewers or 8 hours of streaming time. 

  return (
    <>
      <AlertModal
        open={essentialsAlertOpen}
        onClose={handleCancelPro}
        onContinue={closeEssentialsAlert}
        text="If you cancel your Pro plan, you will lose access to advanced features such as the ability to control branding, custom registration fields, advanced analytics, and more. Are you sure you want to cancel? "
        closeText="Cancel Pro Plan"
        continueText="Go Back"
      />
      <div className={classes.root}>
        <Typography id="unique-viewers-slider" align="center" gutterBottom>
          Maximum Viewers
        </Typography>
        <br></br>
        <br></br>
        <Slider
          value={viewers}
          onChange={handleChangeViewers}
          valueLabelFormat={valueLabelFormatViewers} // previously valueLabelFormatViewers
          getAriaValueText={valuetextViewers}
          aria-labelledby="unique-viewers-slider"
          min={500}
          max={5500}
          step={null}
          valueLabelDisplay="on"
          marks={marksViewers}
        />
        <br></br>
        <br></br>

        <Typography id="streaming-time-slider" align="center" gutterBottom>
          Streaming Time
        </Typography>
        <br></br>
        <br></br>
        <Slider
          value={streamingTime}
          onChange={handleChangeStreamingTime}
          valueLabelFormat={valueLabelFormatTime}
          getAriaValueText={valuetextTime}
          aria-labelledby="streaming-time-slider"
          min={1}
          max={9}
          step={null}
          valueLabelDisplay="on"
          marks={marksTime}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <br></br>
        <p>{valueLabelFormatViewers(viewers) + ' viewers for ' + valueLabelFormatTime(streamingTime) + 'our(s)'}</p>
        {contactUs === false && (
          <>
            <p>{'$' + Price + ' USD'}</p>
            <span style={{ color: 'grey' }}>
              *additional viewers or time will be billed <br></br>at $.01 per viewer per minute.
            </span>
            <br></br>
            <br></br>
            <button className="Button1" onClick={handleUpdatePlan}>Update Plan</button>
          </>
        )}
        {contactUs === true && (
          <>
          <p>Contact us for a price!</p>
          <br></br> 
          <br></br>
          <br></br>
          <button className="Button1" >Contact Us</button>
          </>
        )}
        <br></br>
        <br></br>
        <div className="link1" onClick={openEssentialsAlert}>Cancel Pro Plan</div>
      </div>
    </>
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
