import React, { useRef, useEffect } from "react";
import MapOL from "ol/Map";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();
  const mapInstanceRef = useRef(null); // Reference to store the MapOL instance

  const { center, zoom } = props;

  useEffect(() => {
    // Clean up any existing map instance before creating a new one
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(null);
      mapInstanceRef.current = null;
    }

    // Create a new map instance
    mapInstanceRef.current = new MapOL({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
      interactions: MapOL.defaultInteractions, // Enable default interactions
    });

    // Cleanup on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null);
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map  map-active ${props.className}`}
      style={{ width: "100%", height: "400px", ...props.style }}
    ></div>
  );
};

export default Map;
