import "./App.css";
import { useEffect, useState } from "react";
import uniqid from "uniqid";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import greenPin from "../src/assets/geo-alt-fill-green.svg";
import bluePin from "../src/assets/geo-alt-fill-blue.svg";
import redPin from "../src/assets/geo-alt-fill-red.svg";
import RouteMachine from "./RouteMachine";

function App() {
  const [markers, setMarkers] = useState([]);
  let [markerCount, setMarkerCount] = useState(1);
  const LeafIcon = L.Icon.extend({
    options: {},
  });

  const greenPinIcon = new LeafIcon({
    iconUrl: "src/assets/geo-alt-fill-green.svg",
    iconAnchor: [20, 40],
    iconSize: [40],
  });

  const bluePinIcon = new LeafIcon({
    iconUrl: "src/assets/geo-alt-fill-blue.svg",
    iconAnchor: [20, 40],
    iconSize: [40],
  });

  const redPinIcon = new LeafIcon({
    iconUrl: "src/assets/geo-alt-fill-red.svg",
    iconAnchor: [20, 40],
    iconSize: [40],
  });

  function clearMarkers() {
    setMarkers([]);
    setMarkerCount(1);
  }

  function removeMarker() {
    if (markers.length > 0) {
      const lastMarkerID = markers[markers.length - 1].id;
      setMarkers(markers.filter((marker) => marker.id != lastMarkerID));
      setMarkerCount(markerCount - 1);
    } else {
      console.log("No markers to delete");
    }
  }

  function LocationMarkers() {
    if (markerCount < 6) {
      const map = useMapEvents({
        click(e) {
          console.log(markers);
          {
            markers.length >= 2 && setMarkerCount(markerCount + 1);
          }
          let stopNum = 0;
          {
            markers.length === 0
              ? (stopNum = "start")
              : markers.length === 1
              ? (stopNum = "end")
              : (stopNum = markerCount);
          }
          setMarkers((prevValue) => [
            ...prevValue,
            {
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              id: uniqid(),
              stopNum: stopNum,
            },
          ]); // 1 behind
        },
      });
    } else {
      alert("limited to 5 markers for testing");
    }

    return (
      <>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker}
            icon={
              index === 0
                ? greenPinIcon
                : index === 1
                ? redPinIcon
                : bluePinIcon
            }
            onClick={removeMarker}
            value={marker.id}
          >
            <Popup>
              {/* Lat: {marker.lat} <br></br>Lng: {marker.lng} */}
              {index === 0
                ? "Your Start Point"
                : index === 1
                ? "Your End Point"
                : `Stop #${marker.stopNum}`}
            </Popup>
          </Marker>
        ))}
      </>
    );
  }

  async function getAllRoutes() {
    console.log("Getting all routes...");
    const response = await fetch(
      "https://final-project-backend-lp20.onrender.com/routes"
    );
    const data = await response.json();
    console.log(data.payload);
  }

  async function getRouteById() {
    const id = "6";
    console.log(`Getting route ${id}...`);
    const response = await fetch(
      `https://final-project-backend-lp20.onrender.com/route/${id}`
    );
    const data = await response.json();
    console.log(data);
  }

  async function saveNewRoute() {
    const body = {
      name: "friday",
      data: "Test Coordinates",
    };
    console.log(`Adding route ${body.name}...`);
    const response = await fetch(
      "https://final-project-backend-lp20.onrender.com/newRoute",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    console.log(data);
  }

  async function deleteRoute() {
    const id = "11";
    console.log(`Deleting Route ${id}...`);
    const response = await fetch(
      `https://final-project-backend-lp20.onrender.com/delete/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    console.log(data);
  }

  return (
    <>
      {/* <h1>LeafletJS React Testing</h1>
      <div id="map">
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarkers />
          <RouteMachine />
        </MapContainer>
      </div>
      <button onClick={clearMarkers}>Remove All Markers</button>
      <button>Plot Route</button>
      <button onClick={removeMarker}>Remove Last Marker</button>
      <table>
        <thead>
          <tr>
            <th>StopNum</th>
            <th>StopID</th>
            <th>Lat</th>
            <th>Lng</th>
          </tr>
        </thead>

        <tbody>
          {markers.length > 0 && (
            <tr>
              <td>{markers[0].stopNum}</td>
              <td>{markers[0].id}</td>
              <td>{markers[0].lat}</td>
              <td>{markers[0].lng}</td>
            </tr>
          )}

          {/* map inbetween

          {markers.slice(2).map((stop, key) => {
            return (
              <tr key={key}>
                <td key={`StopNum ${stop.stopNum}`}>{stop.stopNum}</td>
                <td key={`Id ${stop.id}`}>{stop.id}</td>
                <td key={`Lat ${stop.lat}`}>{stop.lat}</td>
                <td key={`Lng ${stop.lng}`}>{stop.lng}</td>
              </tr>
            );
          })}

          {markers.length >= 2 && (
            <tr>
              <td>{markers[1].stopNum}</td>
              <td>{markers[1].id}</td>
              <td>{markers[1].lat}</td>
              <td>{markers[1].lng}</td>
            </tr>
          )}
        </tbody>
      </table> */}
      <button onClick={getAllRoutes}>Get all routes</button>
      <button onClick={getRouteById}>Get Route ID 6</button>
      <button onClick={saveNewRoute}>Save new route</button>
      <button onClick={deleteRoute}>Delete Route</button>
    </>
  );
}

export default App;
