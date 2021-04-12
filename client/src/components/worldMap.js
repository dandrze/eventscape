import React, { memo } from "react";
import LockSharpIcon from '@material-ui/icons/LockSharp';
import { VectorMap } from "react-jvectormap";
import { Link } from "react-router-dom";


const WorldMap = ({ data, disabled }) => {
  console.log(data);

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

  console.log(visitorLocations);

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
        markers={disabled ? null : visitorLocations}
        containerStyle={{
          width: "100%",
          height: "100%",
        }}
        containerClassName="map"
      />
      {disabled ? <Link to="/plan"><div className="disabled-overlay" style={{backgroundColor: "rgba(0,0,0,0.2)", position: "absolute", width: "100%", height: "100%", top: 0, display: "flex",
    justifyContent: "center",
    alignItems: "center", flexDirection: "column"}}><LockSharpIcon style={{color: "#fff", margin: "20px", fontSize: "60px"}}/><div  style={{color: "#fff", textShadow: "1px 1px 4px #757575"}}>Upgrade to premium to access this feature.</div> </div></Link> : null}
    </div>
  );
};

export default memo(WorldMap);
