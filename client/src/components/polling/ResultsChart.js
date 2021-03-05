import React, { useEffect, useState } from "react";
import { HorizontalBar } from "react-chartjs-2";

import api from "../../api/server";

export default (props) => {
  const [results, setResults] = useState(props.results || []);

  useEffect(() => {
    // if the poll is being called with data, populate that data
    // if there is no results provided, then a pollId will be provided for us to fetch the results
    if (!props.results) fetchResults();
  }, []);

  const fetchResults = async () => {
    const resultsRes = await api.get("/api/polling/results", {
      params: { pollId: props.pollId },
    });

    const { results, totalResponded } = resultsRes.data;

    // set results to the new poll option with responses added to it
    setResults(results);
  };

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
        {props.question}{" "}
        {props.allowMultiple ? "(Select Multiple)" : "(Select One)"}
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
