import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { HorizontalBar } from "react-chartjs-2";

import * as actions from "../../actions";

const ResultsChart = ({ event, results, question, allowMultiple }) => {
  const [chartHeight, setChartHeight] = useState("250px");

  useEffect(() => {
    // The code below is used to calculate the total height of the chart
    // It finds the label with the most lines, and then multiplies that by the number of labels to get the total number of line space required per label
    let lines = 0;
    // Finds the label with the most lines
    for (let label of labels) {
      lines = Math.max(lines, label.length);
    }
    // multiplies by the total number of labels (options)
    lines = lines * labels.length;

    //set the chart height to the number of total lines x 16px and add 100px for space above and below labels
    setChartHeight((lines * 16 + 120).toString() + "px");
  });

  const testWhite = (x) => {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
  };

  const splitLabel = (str, maxWidth) => {
    const labelArray = [];
    var newLineStr = "\n";
    var done = false;
    while (str.length > maxWidth) {
      var found = false;
      // Inserts new line at first whitespace of the line
      for (var i = maxWidth - 1; i >= 0; i--) {
        if (testWhite(str.charAt(i))) {
          labelArray.push(str.slice(0, i));
          str = str.slice(i + 1);
          found = true;
          break;
        }
      }
      // Inserts new line at maxWidth position, the word is too long to wrap
      if (!found) {
        labelArray.push(str.slice(0, maxWidth));
        str = str.slice(maxWidth);
      }
    }

    labelArray.push(str);

    return labelArray;
  };

  const labels = results.map((option) => {
    return splitLabel(option.text, 40);
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
      <div
        style={{
          width: "100%",
          height: chartHeight,
        }}
      >
        <HorizontalBar
          key={chartHeight}
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
