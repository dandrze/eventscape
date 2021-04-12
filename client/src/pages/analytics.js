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
import AccessDeniedScreen from "../components/AccessDeniedScreen";

const Analytics = (props) => {
  const [data, setData] = useState({
    current: 0,
    unique: 0,
    data: [],
    history: [],
    loaded: false,
  });

  useEffect(() => {
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
          visitorData: visitors.visitorData,
          history: visitors.history,
          loaded: true,
        });

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
      clearTimeout(timeout);
    };
  }, [props.event.id]);

  return (
    <div>
      <NavBar3
        displaySideNav="true"
        highlight={"analytics"}
        content={
          // only display content once the event is loaded
          props.event.id ? (
            props.event.permissions?.analytics ? (
              <div className="boxes-main-container container-width">
                <div className="UVContainer">
                  <div className="form-box shadow-border currentUV">
                    <h3>Current Unique Viewers</h3>
                    <h2>
                      {data.loaded ? (
                        data.current
                      ) : (
                        <CircularProgress size={30} />
                      )}
                    </h2>
                  </div>
                  <div className="form-box shadow-border totalUV">
                    <h3>Total Unique Viewers</h3>
                    <h2>
                      {data.loaded ? (
                        data.unique
                      ) : (
                        <CircularProgress size={30} />
                      )}
                    </h2>
                  </div>
                </div>
                <div className="form-box shadow-border" id="uniqueViewersTable">
                  <h3>Unique Viewers over Time</h3>
                  <br></br>
                  <div className="uniqueViewersChart">
                    {data.loaded ? (
                      <LineChart
                        data={data.history}
                        title="Unique Viewers"
                        color="#B0281C"
                      />
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <CircularProgress size={40} className="margin-auto" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="shadow-border viewerLocation">
                  <div id="viewerLocationHeader">
                    <h3>Viewer Location</h3>
                  </div>
                  {!data.loaded ? (
                    <div style={{ textAlign: "center" }}>
                      <CircularProgress size={40} />
                    </div>
                  ) : data.visitorData ? (
                    <WorldMap data={data.visitorData} className="margin-auto" disabled={props.event.plan.PlanType.type === "free"} />
                  ) : null}
                </div>
                <div className="form-box shadow-border table-box">
                  <h3>Logins</h3>
                  {data.loaded ? (
                    <LoginsTable data={data.visitorData} />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <CircularProgress size={40} className="margin-auto" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <AccessDeniedScreen message="Please contact the event owner to provide you with permissions to this page." />
            )
          ) : null
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
