import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { HorizontalBar } from "react-chartjs-2";

import * as actions from "../../actions";

const ResultsChart = ({ results, question, allowMultiple }) => {
  console.log(results);
  const labels = results.map((option) => {
    return option.text;
  });
  const pollData = results.map((option) => {
    return option.selections;
  });

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: pollData,
      },
    ],
  };

  console.log(results);

  return (
    <>
      <h5>
        {question} {allowMultiple ? "(Select Multiple)" : "(Select One)"}
      </h5>
      <div style={{ width: "100%", height: "250px" }}>
        <HorizontalBar
          data={data}
          // width={100}
          //height={"20px"}
          options={{
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
          }}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { polling: state.polling, event: state.event };
};

export default connect(mapStateToProps, actions)(ResultsChart);
