const makeMapBtn = document.getElementById("make-map-button");

var map = L.map("map").setView([52.655713676022906, -2.4278224601277376], 12);
const coordinates = [];
const coordinatesLATLNG = [];
//setView([coordinates to view], zoom level)

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let route = [];

function onMapClick(e) {
  const coordinatesRAW = { lat: e.latlng.lat, lng: e.latlng.lng };
  const coordinatesFORMATTED = {
    lng: coordinatesRAW.lng,
    lat: coordinatesRAW.lat,
  };
  coordinates.push(coordinatesFORMATTED);
  coordinatesLATLNG.push(coordinatesRAW);
  var marker = new L.marker(e.latlng)
    .addTo(map)
    .on("click", (e) => e.target.remove());
}

map.on("click", onMapClick);

// if only two points, no need for this api
async function planRoute(coordinates) {
  const start = [coordinates[0].lng, coordinates[0].lat];
  const end = { location: [coordinates[1].lng, coordinates[1].lat] };

  const shipments = [];

  const locations = [];
  for (let i = 2; i < coordinates.length; i++) {
    locations.push({
      id: `stop-${i - 1}`,
      location: [coordinates[i].lng, coordinates[i].lat],
    });
    shipments.push({
      id: `order_${i - 1}`,
      pickup: { location_index: i - 2, duration: 120 },
      delivery: end,
    });
  }

  const body = {
    mode: "drive",
    agents: [
      {
        start_location: start,
        time_windows: [[0, 10800]],
      },
    ],
    shipments: shipments,
    locations: locations,
  };
  const response = await fetch(
    "https://api.geoapify.com/v1/routeplanner?apiKey=5af640ebfb754448a221e4857a5fc4a1",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await response.json();
  console.log(JSON.parse(JSON.stringify(data)));

  // L.geoJSON(data.features[0].geometry).addTo(map);
}

async function plotRoute() {
  const start = coordinatesLATLNG[0];
  const end = coordinatesLATLNG[1];
  let waypoints = "";
  for (let i = 2; i < coordinatesLATLNG.length; i++) {
    waypoints += `${coordinatesLATLNG[i].lat},${coordinatesLATLNG[i].lng}|`;
  }
  const url = `https://api.geoapify.com/v1/routing?waypoints=${start.lat},${start.lng}|${waypoints}${end.lat},${end.lng}&mode=drive&details=instruction_details&apiKey=5af640ebfb754448a221e4857a5fc4a1`;
  const response = await fetch(url);
  const data = await response.json();
  L.geoJSON(data)
    //   {
    //   style: (feature) => {
    //     return {
    //       color: "rgba(20, 137, 255, 0.7)",
    //       weight: 5,
    //     };
    //   },
    // })
    //   .bindPopup((layer) => {
    //     return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`;
    //   })
    .addTo(map);
}

makeMapBtn.addEventListener("click", async () => {
  await planRoute(coordinates);
  await plotRoute();
});

// const myMap = [
//   {
//     type: "FeatureCollection",
//     properties: {
//       mode: "drive",
//       params: {
//         mode: "drive",
//         agents: [
//           {
//             start_location: [-2.3646431889625052, 52.67213495771259],
//             time_windows: [[0, 10800]],
//           },
//         ],
//         shipments: [
//           {
//             id: "order_1",
//             pickup: {
//               location_index: 0,
//               duration: 120,
//             },
//             delivery: {
//               location: [-2.4845556267250464, 52.627797560547165],
//             },
//           },
//           {
//             id: "order_2",
//             pickup: {
//               location_index: 1,
//               duration: 120,
//             },
//             delivery: {
//               location: [-2.4845556267250464, 52.627797560547165],
//             },
//           },
//           {
//             id: "order_3",
//             pickup: {
//               location_index: 2,
//               duration: 120,
//             },
//             delivery: {
//               location: [-2.4845556267250464, 52.627797560547165],
//             },
//           },
//         ],
//         locations: [
//           {
//             id: "stop-1",
//             location: [-2.3778897187046337, 52.66562542507331],
//           },
//           {
//             id: "stop-2",
//             location: [-2.4509268549355308, 52.6381596085681],
//           },
//           {
//             id: "stop-3",
//             location: [-2.473889110886318, 52.66279000764185],
//           },
//         ],
//       },
//     },
//     features: [
//       {
//         geometry: {
//           type: "MultiLineString",
//           coordinates: [
//             [
//               [-2.364643, 52.672135],
//               [-2.37789, 52.665625],
//             ],
//             [
//               [-2.37789, 52.665625],
//               [-2.473889, 52.66279],
//             ],
//             [
//               [-2.473889, 52.66279],
//               [-2.450927, 52.63816],
//             ],
//             [
//               [-2.450927, 52.63816],
//               [-2.484556, 52.627798],
//             ],
//           ],
//         },
//         type: "Feature",
//         properties: {
//           agent_index: 0,
//           time: 1490,
//           start_time: 0,
//           end_time: 1490,
//           distance: 20293,
//           legs: [
//             {
//               time: 163,
//               distance: 1742,
//               from_waypoint_index: 0,
//               to_waypoint_index: 1,
//               steps: [
//                 {
//                   from_index: 0,
//                   to_index: 1,
//                   time: 163,
//                   distance: 1742,
//                 },
//               ],
//             },
//             {
//               time: 521,
//               distance: 11645,
//               from_waypoint_index: 1,
//               to_waypoint_index: 2,
//               steps: [
//                 {
//                   from_index: 0,
//                   to_index: 1,
//                   time: 521,
//                   distance: 11645,
//                 },
//               ],
//             },
//             {
//               time: 251,
//               distance: 3947,
//               from_waypoint_index: 2,
//               to_waypoint_index: 3,
//               steps: [
//                 {
//                   from_index: 0,
//                   to_index: 1,
//                   time: 251,
//                   distance: 3947,
//                 },
//               ],
//             },
//             {
//               time: 195,
//               distance: 2959,
//               from_waypoint_index: 3,
//               to_waypoint_index: 4,
//               steps: [
//                 {
//                   from_index: 0,
//                   to_index: 1,
//                   time: 195,
//                   distance: 2959,
//                 },
//               ],
//             },
//           ],
//           mode: "drive",
//           actions: [
//             {
//               index: 0,
//               type: "start",
//               start_time: 0,
//               duration: 0,
//               waypoint_index: 0,
//             },
//             {
//               index: 1,
//               type: "pickup",
//               start_time: 163,
//               duration: 120,
//               shipment_index: 0,
//               shipment_id: "order_1",
//               location_index: 0,
//               location_id: "stop-1",
//               waypoint_index: 1,
//             },
//             {
//               index: 2,
//               type: "pickup",
//               start_time: 804,
//               duration: 120,
//               shipment_index: 2,
//               shipment_id: "order_3",
//               location_index: 2,
//               location_id: "stop-3",
//               waypoint_index: 2,
//             },
//             {
//               index: 3,
//               type: "pickup",
//               start_time: 1175,
//               duration: 120,
//               shipment_index: 1,
//               shipment_id: "order_2",
//               location_index: 1,
//               location_id: "stop-2",
//               waypoint_index: 3,
//             },
//             {
//               index: 4,
//               type: "delivery",
//               start_time: 1490,
//               duration: 0,
//               shipment_index: 2,
//               shipment_id: "order_3",
//               waypoint_index: 4,
//             },
//             {
//               index: 5,
//               type: "delivery",
//               start_time: 1490,
//               duration: 0,
//               shipment_index: 0,
//               shipment_id: "order_1",
//               waypoint_index: 4,
//             },
//             {
//               index: 6,
//               type: "delivery",
//               start_time: 1490,
//               duration: 0,
//               shipment_index: 1,
//               shipment_id: "order_2",
//               waypoint_index: 4,
//             },
//             {
//               index: 7,
//               type: "end",
//               start_time: 1490,
//               duration: 0,
//             },
//           ],
//           waypoints: [
//             {
//               original_location: [-2.3646431889625052, 52.67213495771259],
//               location: [-2.364643, 52.672135],
//               start_time: 0,
//               duration: 0,
//               actions: [
//                 {
//                   index: 0,
//                   type: "start",
//                   start_time: 0,
//                   duration: 0,
//                   waypoint_index: 0,
//                 },
//               ],
//               next_leg_index: 0,
//             },
//             {
//               original_location: [-2.3778897187046337, 52.66562542507331],
//               location: [-2.37789, 52.665625],
//               start_time: 163,
//               duration: 120,
//               actions: [
//                 {
//                   index: 1,
//                   type: "pickup",
//                   start_time: 163,
//                   duration: 120,
//                   shipment_index: 0,
//                   shipment_id: "order_1",
//                   location_index: 0,
//                   location_id: "stop-1",
//                   waypoint_index: 1,
//                 },
//               ],
//               original_location_index: 0,
//               original_location_id: "stop-1",
//               prev_leg_index: 0,
//               next_leg_index: 1,
//             },
//             {
//               original_location: [-2.473889110886318, 52.66279000764185],
//               location: [-2.473889, 52.66279],
//               start_time: 804,
//               duration: 120,
//               actions: [
//                 {
//                   index: 2,
//                   type: "pickup",
//                   start_time: 804,
//                   duration: 120,
//                   shipment_index: 2,
//                   shipment_id: "order_3",
//                   location_index: 2,
//                   location_id: "stop-3",
//                   waypoint_index: 2,
//                 },
//               ],
//               original_location_index: 2,
//               original_location_id: "stop-3",
//               prev_leg_index: 1,
//               next_leg_index: 2,
//             },
//             {
//               original_location: [-2.4509268549355308, 52.6381596085681],
//               location: [-2.450927, 52.63816],
//               start_time: 1175,
//               duration: 120,
//               actions: [
//                 {
//                   index: 3,
//                   type: "pickup",
//                   start_time: 1175,
//                   duration: 120,
//                   shipment_index: 1,
//                   shipment_id: "order_2",
//                   location_index: 1,
//                   location_id: "stop-2",
//                   waypoint_index: 3,
//                 },
//               ],
//               original_location_index: 1,
//               original_location_id: "stop-2",
//               prev_leg_index: 2,
//               next_leg_index: 3,
//             },
//             {
//               original_location: [-2.4845556267250464, 52.627797560547165],
//               location: [-2.484556, 52.627798],
//               start_time: 1490,
//               duration: 0,
//               actions: [
//                 {
//                   index: 4,
//                   type: "delivery",
//                   start_time: 1490,
//                   duration: 0,
//                   shipment_index: 2,
//                   shipment_id: "order_3",
//                   waypoint_index: 4,
//                 },
//                 {
//                   index: 5,
//                   type: "delivery",
//                   start_time: 1490,
//                   duration: 0,
//                   shipment_index: 0,
//                   shipment_id: "order_1",
//                   waypoint_index: 4,
//                 },
//                 {
//                   index: 6,
//                   type: "delivery",
//                   start_time: 1490,
//                   duration: 0,
//                   shipment_index: 1,
//                   shipment_id: "order_2",
//                   waypoint_index: 4,
//                 },
//               ],
//               prev_leg_index: 3,
//             },
//           ],
//         },
//       },
//     ],
//   },
// ];
