// Initialize Firebase
var config = {
  apiKey: "AIzaSyBd-obnWhyeyLTgHBsCsmxe4vnCh7Sw87M",
  authDomain: "mymap-18a62.firebaseapp.com",
  databaseURL: "https://mymap-18a62.firebaseio.com",
  projectId: "mymap-18a62",
  storageBucket: "mymap-18a62.appspot.com",
  messagingSenderId: "1055368148212"
};
firebase.initializeApp(config);

//unique counter for each data
let d = new Date();
let uid = d.getTime();
let counter = uid;

//get form
document.getElementById("map-form").addEventListener("submit", submitMap);

function submitMap(e) {
  e.preventDefault();

  let place = getInput("place");
  let lat = getInput("lat");
  let lng = getInput("lng");

  saveMap(place, lat, lng);
  initMap();

  //alert message
  document.querySelector(".alert").style.display = "block";

  //hide after 3 second
  setTimeout(function() {
    document.querySelector(".alert").style.display = "none";
  }, 2000);
  document.getElementById("map-form").reset();
}

//fuction to get form values
function getInput(id) {
  return document.getElementById(id).value;
}

//save data to database
function saveMap(place, lat, lng) {
  counter += 1;
  let map = {
    id: counter,
    place: place,
    lat: lat,
    lng: lng
  };
  let mapRef = firebase.database().ref("mymap/" + counter);
  mapRef.set(map);
  document.getElementById("box").innerHTML = "";
}

//retrieve data from database
function getMaps() {
  let mapRef = firebase.database().ref("mymap/");
  mapRef.on("child_added", function(data) {
    let res = data.val();
    document.getElementById("box").innerHTML += `
        <ul>
        <li>Name of Place:${res.place}</li>
        <li>Latitude:${res.lat}</li>
        <li>Longitude:${res.lng}</li>
        <button class="btn" onclick="updateMap(${res.id},'${res.place}',${
      res.lat
    }, ${res.lng})"><i class="fas fa-edit"></i> Edit</button>
    </ul>
    <br><br>
        `;
  });
}

//Initiate map
function initMap() {
    getMaps();
  //Map options
  let options = {
    center: { lat: 27.7172, lng: 85.324 },
    zoom: 8
  };
  //new map
  let map = new google.maps.Map(document.getElementById("map"), options);
  let mapRef = firebase.database().ref("mymap/");
  mapRef.once("value").then(function(snapshot) {
    snapshot.forEach(function(data) {
      let res = data.val();
      let lat = parseFloat(res.lat);
      let lng = parseFloat(res.lng);
      let content = res.place;
      let markers = [{ coords: { lat, lng }, content: content }];
      markers.map(map => addMarker(map));
    });
  });
  //add a marker function
  function addMarker(props) {
    //add a marker
    let marker = new google.maps.Marker({
      position: props.coords,
      map: map,
      icon: "http://maps.google.com/mapfiles/kml/shapes/cabs.png"
    });

    if (props.content) {
      //add a info window
      let infowindow = new google.maps.InfoWindow({
        content: props.content
      });
      marker.addListener("click", function() {
        infowindow.open(map, marker);
      });
    }
  }
}

//function to update map
function updateMap(counter, place, lat, lng) {
  document.getElementById("section-first").innerHTML = `
    <form class="form-inline" id="map-form2">
    <label for="place">Name Of Place</label>
    <input type="text" id="place" placeholder="Enter Name Of Place" name="place" required>
    <label for="lat">Latitude:</label>
    <input type="number" id="lat" placeholder="Enter Latitude" name="lat" step="0.0001" required>
    <label for="lng">Longitude:</label>
    <input type="number" id="lng" placeholder="Enter Longitude" name="lng" step="0.0001" required>
    <button style="display: none" type="submit">Submit</button>
    <button type="button" style="display: block" id="button2" type="submit">Edit</button>
    </form>
    `;

  document.getElementById("button2").addEventListener("click", e => {
    editMap(
      counter,
      document.getElementById("place").value,
      document.getElementById("lat").value,
      document.getElementById("lng").value
    );
    //alert message
    document.querySelector(".alert-edit").style.display = "block";

    //hide after 3 second
    setTimeout(function() {
      document.querySelector(".alert-edit").style.display = "none";
    }, 2000);
  });
  document.getElementById("place").value = place;
  document.getElementById("lat").value = lat;
  document.getElementById("lng").value = lng;
}

//to modify the existing map
function editMap(id, place, lat, lng) {
  let mapEdited = {
    id: id,
    place: place,
    lat: lat,
    lng: lng
  };
  let mapRef = firebase.database().ref("mymap/" + id);
  mapRef.set(mapEdited);
  document.getElementById("box").innerHTML = "";
  reset();
  initMap();
}

//function to reset after editing
function reset() {
  document.getElementById("section-first").innerHTML = `
    <form class="form-inline" id="map-form">
    <label for="place">Name Of Place</label>
    <input type="text" id="place" placeholder="Enter Name Of Place" name="place" required>
    <label for="lat">Latitude:</label>
    <input type="number" id="lat" placeholder="Enter Latitude" name="lat" step="0.0001" required>
    <label for="lng">Longitude:</label>
    <input type="number" id="lng" placeholder="Enter Longitude" name="lng" step="0.0001" required>
    <button type="submit">Submit</button>
    <button style="display: none" id="button2" type="submit">Edit</button>
  </form>
   `;

  document.getElementById("map-form").addEventListener("submit", submitMap);
}
