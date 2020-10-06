import React, { Component } from 'react';
import { VectorMap } from "react-jvectormap"

class WorldMap extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
          };
      }
  
      render(){
          return(
            <div style={{ width: '100%', height: 550 }}>
          <VectorMap
            map={"world_mill"}
            backgroundColor="#FFFF"
            markerStyle={{
              initial: {
                fill: "#B0281C",
                stroke: "#383f47"
              }
            }}
            series={{
              markers: [
                {
                  attribute: "r",
                  scale: [5, 20],
                  values: [60, 6, 54],
                  normalizeFunction: "polynomial"
                }
              ]
            }}
            regionStyle={{
              initial: {
                fill: "rgba(0,0,0,0.1)"
              },
              hover: {
                fill: "rgba(0,0,0,0.3)"
              }
            }}
            markers={[
              {
                latLng: [43.6532, -79.3832],
                name: "Toronto",
                value: 20
              },
              {
                latLng: [49.246292, -123.116226],
                name: "Vancouver",
                value: 20
              },
              {
                latLng: [51.509865, -0.118092],
                name: "London",
                value: 16
              }
            ]}
            ref="map"
            containerStyle={{
              width: "100%",
              height: "100%"
            }}
            containerClassName="map"
          />
        </div>
          )
      }
  };

  export default WorldMap;