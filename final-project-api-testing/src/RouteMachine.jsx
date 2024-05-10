import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "./RouteMachine.css";

const createRoutineMachineLayer = (props) => {
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(51.497687503917255, -0.10316848754882814),
      L.latLng(51.49982479664027, -0.08411407470703126),
      L.latLng(51.49782479664027, -0.08411407470703126),
    ],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 6 }],
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: false,
  });

  return instance;
};

const RouteMachine = createControlComponent(createRoutineMachineLayer);

export default RouteMachine;
