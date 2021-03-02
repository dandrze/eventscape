import React from "react";
import { HorizontalBar } from "react-chartjs-2";

export default ({ question, results }) => {
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

  return (
    <>
      <h5>{question}</h5>
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
