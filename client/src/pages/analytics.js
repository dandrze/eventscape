import React, { Component } from 'react';
import NavBar3 from '../components/navBar3.js';
import Tabs from "../components/Tabs"; 
import Chart from 'chart.js/dist/Chart.bundle';
import LoginsTable from '../components/LoginsTables';
import WorldMap from '../components/worldMap';
import './analytics.css';

export default class Analytics extends React.Component {
    render() {
        return(
            <div>
                <NavBar3 
                  displaySideNav="true" 
                  highlight={"analytics"}
                  content={<Content />}
                />
            </div>
        )
    }
}

class Content extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
          };
      }
  
      render(){
          return(
            <div className="mainWrapper container-width">
                <div className="UVContainer">
                    <div className="form-box shadow-border currentUV">
                        <h3>Current Unique Viewers</h3>
                        <h2>2712</h2>
                    </div>
                    <div className="form-box shadow-border totalUV">
                        <h3>Total Unique Viewers</h3>
                        <h2>3324</h2>
                    </div>
                </div>
                <div className="form-box shadow-border" id="uniqueViewersTable">
                    <h3>Unique Viewers over Time</h3>
                    <br></br>
                    <UniqueViewersChart />
                </div>
                <div className="shadow-border viewerLocation">
                        <div id="viewerLocationHeader">
                            <h3>Viewer Location</h3>
                        </div>
                    <WorldMap />
                </div>
                <div className="form-box shadow-border" id="loginsTable">
                    <h3>Logins</h3> 
                    <LoginsTable />
                </div>
            </div>
          )
      }
  };

// Chart.js:
Chart.defaults.global.defaultFontFamily = "Roboto, Helvetica Neue, Arial, sans-serif";

// Data generation
function getRandomArray(numItems) {
  // Create random array of objects
  let names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let data = [];
  for(var i = 0; i < numItems; i++) {
    data.push({
      label: names[i],
      value: Math.round(20 + 80 * Math.random())
    });
  }
  return data;
}

function getUniqueViewersArray(numItems) {
// Create random array of objects (with date)
let data = [];
let baseTime = new Date('2021-05-01T19:00:00').getTime();
let dayMs = 60 * 1000;
for(var i = 0; i < numItems; i++) {
  data.push({
    time: new Date(baseTime + i * dayMs),
    value: Math.round(2000 + 2000 * Math.random())
  });
}
return data;
  }

function getRandomDateArray(numItems) {
  // Create random array of objects (with date)
  let data = [];
  let baseTime = new Date('2018-05-01T19:00:00').getTime();
  let dayMs = 24 * 60 * 60 * 1000;
  for(var i = 0; i < numItems; i++) {
    data.push({
      time: new Date(baseTime + i * dayMs),
      value: Math.round(20 + 80 * Math.random())
    });
  }
  return data;
}

function getData() {
  let data = [];

  data.push({
    title: 'Unique Viewers',
    data: getUniqueViewersArray(150)
  });

  data.push({
    title: 'Categories',
    data: getRandomArray(20)
  });

  data.push({
    title: 'Categories',
    data: getRandomArray(10)
  });

  data.push({
    title: 'Data 4',
    data: getRandomArray(6)
  });

  return data;
}

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
    this.myChart.data.labels = this.props.data.map(d => d.time);
    this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'line',
      options: {
			  maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'hour'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0
              }
            }
          ]
        },
        legend: {
            display: false
        }
      },
      data: {
        labels: this.props.data.map(d => d.time),
        datasets: [{
          label: this.props.title,
          data: this.props.data.map(d => d.value),
          fill: 'none',
          backgroundColor: this.props.color,
          pointRadius: 2,
          borderColor: this.props.color,
          borderWidth: 1,
          lineTension: 0
        }]
      }
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

// UniqueViewersChart
class UniqueViewersChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: getData()
    };
  }

  componentDidMount() {
    window.setInterval(() => {
      this.setState({
        data: getData()
      })
    }, 50000000) // Set back to 5000 (5 seconds) once actual data is connected.
  }

  render() {
    return (
        <div className="uniqueViewersChart">
          <LineChart
            data={this.state.data[0].data}
            title={this.state.data[0].title}
            color="#B0281C"
          />
        </div>
    );
  }
}