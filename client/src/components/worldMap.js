import React, { useEffect, useState, memo } from "react";
import LockSharpIcon from "@material-ui/icons/LockSharp";
import { VectorMap } from "react-jvectormap";
import { Link } from "react-router-dom";

const WorldMap = memo(({ data }) => {
  const visitorLocations = data
    .map((visitor) => {
      if (visitor.lat) {
        return {
          latLng: [visitor.lat, visitor.long],
          name: visitor.city,
        };
      } else {
        return null;
      }
    })
    .filter((location) => location != null);

  return (
    <div style={{ width: "100%", height: 550, position: "relative" }}>
      <VectorMap
        map={"world_mill"}
        backgroundColor="#FFFF"
        markerStyle={{
          initial: {
            fill: "#B0281C",
            stroke: "#383f47",
          },
        }}
        series={{
          markers: [
            {
              attribute: "r",
              scale: [5, 20],
              values: [60, 6, 54],
              normalizeFunction: "polynomial",
            },
          ],
        }}
        regionStyle={{
          initial: {
            fill: "rgba(0,0,0,0.1)",
          },
          hover: {
            fill: "rgba(0,0,0,0.3)",
          },
        }}
        markers={visitorLocations}
        containerStyle={{
          width: "100%",
          height: "100%",
        }}
        containerClassName="map"
      />
     
    </div>
  );
});

export default WorldMap;
