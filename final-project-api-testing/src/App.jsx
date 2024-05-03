import "./App.css";
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

function App() {
  const [markers, setMarkers] = useState([]);

  function clearMarkers() {
    setMarkers([]);
  }

  function LocationMarkers() {
    const map = useMapEvents({
      click(e) {
        console.log(markers);
        setMarkers((prevValue) => [...prevValue, e.latlng]); // 1 behind
        // markers.push(e.latlng);
      },
    });

    return (
      <>
        {markers.map((marker) => (
          <Marker position={marker}>
            <Popup>
              Lat: {marker.lat} <br></br>Lng: {marker.lng}
              <br></br>
              <button>X</button>
            </Popup>
          </Marker>
        ))}
      </>
    );
  }

  return (
    <>
      <h1>LeafletJS React Testing</h1>
      <div id="map">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker> */}
          <LocationMarkers />
        </MapContainer>
      </div>
      <button onClick={clearMarkers}>Remove All Markers</button>
      <button>Plot Route</button>
    </>
  );
}

export default App;
