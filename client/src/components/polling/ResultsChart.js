import React from "react";
import { connect } from "react-redux";

import { HorizontalBar } from "react-chartjs-2";

import * as actions from "../../actions";

const ResultsChart = ({ event, results, question, allowMultiple }) => {
  const labels = results.map((option) => {
    return option.text;
  });
  const pollData = results.map((option) => {
    return option.selections;
  });

  const setOpacity = (hex, alpha) =>
    `${hex}${Math.floor(alpha * 255)
      .toString(16)
      .padStart(2, 0)}`;

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: "#b0281c",
        maxBarThickness: 20,
        hoverBackgroundColor: setOpacity("#b0281c", 0.5),
        hoverBorderColor: "#b0281c",
        data: pollData,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true,

            stepSize: 1,
          },
        },
      ],
    },
  };

  return (
    <div style={{ marginBottom: "25px", minWidth: "450px" }}>
      <h5>
        {question} {allowMultiple ? "(Select Multiple)" : "(Select One)"}
      </h5>
      <div style={{ width: "100%", height: "250px" }}>
        <HorizontalBar
          data={data}
          // width={100}
          //height={"20px"}
          options={options}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { polling: state.polling, event: state.event };
};

export default connect(mapStateToProps, actions)(ResultsChart);
