import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import NavBar3 from "../components/navBar3.js";
import Tabs from "../components/Tabs";
import Chart from "chart.js/dist/Chart.bundle";
import LoginsTable from "../components/LoginsTables";
import WorldMap from "../components/worldMap";
import "./analytics.css";
import * as actions from "../actions";

const Analytics = (props) => {
  const [data, setData] = useState({
    current: 0,
    unique: 0,
    data: [],
    history: [],
    loaded: false,
  });

  useEffect(() => {
    console.log("useeffect called");
    var timeout;
    // refresh the data on the dashboard
    const fetchDataAsync = async () => {
      // check to make sure the event was loaded (will crash otherwise)
      if (props.event.id) {
        // fetch data from API
        const visitors = await props.fetchCurrentVisitors(props.event.id);
        // set the counts for current and unique visitors (returned from the server api)
        setData({
          current: visitors.currentCount,
          unique: visitors.uniqueCount,
          data: visitors.data,
          history: visitors.history,
        });
        console.log("fetched");

        // fetch data again in 10 seconds
        timeout = setTimeout(() => {
          fetchDataAsync();
        }, 10000);
      }
    };

    // fetch data once when mounted
    fetchDataAsync();

    // then fetch data every 30 seconds
    //const interval = setInterval(() => fetchDataAsync(), 10 * 1000);

    // cleanup. Clears the timeout when component unmounts.
    return () => {
      console.log("cleared");
      clearTimeout(timeout);
    };
  }, [props.event.id]);

  return (
    <div>
      <NavBar3
        displaySideNav="true"
        highlight={"analytics"}
        content={
          true ? (
            <div className="boxes-main-container container-width">
              <div className="UVContainer">
                <div className="form-box shadow-border currentUV">
                  <h3>Current Unique Viewers</h3>
                  <h2>{data.current}</h2>
                </div>
                <div className="form-box shadow-border totalUV">
                  <h3>Total Unique Viewers</h3>
                  <h2>{data.unique}</h2>
                </div>
              </div>
              <div className="form-box shadow-border" id="uniqueViewersTable">
                <h3>Unique Viewers over Time</h3>
                <br></br>
                <div className="uniqueViewersChart">
                  <LineChart
                    data={data.history}
                    title="Unique Viewers"
                    color="#B0281C"
                  />
                </div>
              </div>
              <div className="shadow-border viewerLocation">
                <div id="viewerLocationHeader">
                  <h3>Viewer Location</h3>
                </div>
                <WorldMap />
              </div>
              <div className="form-box shadow-border table-box">
                <h3>Logins</h3>
                <LoginsTable data={data.data} />
              </div>
            </div>
          ) : (
            <div>
              <CircularProgress />
            </div>
          )
        }
      />
    </div>
  );
};

// Chart.js:
Chart.defaults.global.defaultFontFamily =
  "Roboto, Helvetica Neue, Arial, sans-serif";

/*
// BarChart
class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.myChart.data.labels = this.props.data.map(d => d.label);
    this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'bar',
      options: {
	      maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 100
              }
            }
          ]
        }
      },
      data: {
        labels: this.props.data.map(d => d.label),
        datasets: [{
          label: this.props.title,
          data: this.props.data.map(d => d.value),
          backgroundColor: this.props.color
        }]
      }
    });
  }

  render() {
    return (
        <canvas ref={this.canvasRef} />
    );
  }
}
*/

// LineChart
class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.myChart.data.labels = this.props.data.map((d) => d.time);
    this.myChart.data.datasets[0].data = this.props.data.map((d) => d.value);
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: "line",
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "minute",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
      data: {
        labels: this.props.data.map((d) => d.time),
        datasets: [
          {
            label: this.props.title,
            data: this.props.data.map((d) => d.value),
            fill: "none",
            backgroundColor: this.props.color,
            pointRadius: 2,
            borderColor: this.props.color,
            borderWidth: 1,
            lineTension: 0,
          },
        ],
      },
    });
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

// Doughnut
/*
class DoughnutChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.myChart.data.labels = this.props.data.map(d => d.label);
    this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'doughnut',
      options: {
	      maintainAspectRatio: false
      },
      data: {
        labels: this.props.data.map(d => d.label),
        datasets: [{
          data: this.props.data.map(d => d.value),
          backgroundColor: this.props.colors
        }]
      }
    });

  }


  render() {
    return <canvas ref={this.canvasRef} />;
  }
}
*/

const mapStateToProps = (state) => {
  return {
    event: state.event,
  };
};

export default connect(mapStateToProps, actions)(Analytics);
