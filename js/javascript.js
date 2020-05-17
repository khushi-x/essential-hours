const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAjxFj4_JqT2xlit-uqfxHDSyJOzlZgFI0",
    authDomain: "test-1-7b3cd.firebaseapp.com",
    databaseURL: "https://test-1-7b3cd.firebaseio.com",
    projectId: "test-1-7b3cd",
    storageBucket: "test-1-7b3cd.appspot.com",
    messagingSenderId: "907937019023",
    appId: "1:907937019023:web:4ec6df6d650417d42decfa"
};
// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyAjxFj4_JqT2xlit-uqfxHDSyJOzlZgFI0",
    authDomain: "test-1-7b3cd.firebaseapp.com",
    projectId: "test-1-7b3cd",
});

var db=firebase.firestore();
// Add a new document in collection "cities"
db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
})
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
/*
$("#save").click(function() {
    const starthour=document.querySelector("#add-mod-start").value;
    const endhour=document.querySelector("#add-mod-end").value;
    db.collection("locations").add({
        Identification: localStorage.placeID,
        Name: localStorage.placeName,
        Address: localStorage.placeAddress,
        Coordinates: localStorage.placeCoor,
        ModStart: starthour,
        ModEnd: endhour,

    }).then(function () {
        console.log("Document successfully written!");
    })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error writing document: ", error);
        });
})

const starthour=document.querySelector("#add-mod-start").value;
const endhour=document.querySelector("#add-mod-end").value;
const save=document.querySelector("#submit");
save.addEventListener("click",function() {
    db.collection("locations").set({
        Identification: localStorage.placeID,
        Name: localStorage.placeName,
        Address: localStorage.placeAddress,
        Coordinates: localStorage.placeCoor,


    }).then(function() {

        console.log("Document successfully written!");

*/




// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAjxFj4_JqT2xlit-uqfxHDSyJOzlZgFI0&libraries=places">
function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7128, lng: -74.0060},
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    var geocoder = new google.maps.Geocoder;
    var marker = new google.maps.Marker({map: map});

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        localStorage.placeID = places[0]['place_id']
        localStorage.placeName = places[0]['name'];
        localStorage.placeAddress = places[0]['formatted_address'];
        console.log(localStorage.placeID, localStorage.placeName, localStorage.placeAddress);

        $("#place-id").text(localStorage.placeID);
        $("#place-name").text(localStorage.placeName);
        $("#place-address").text(localStorage.placeAddress);

        if (places.length === 0) {
            return;
        }

        geocoder.geocode({'placeId': localStorage.placeID}, function(results, status) {
            if (status !== 'OK') {
                window.alert('Geocoder failed due to: ' + status);
                return;
            }

            map.setZoom(11);
            map.setCenter(results[0].geometry.location);

            // Set the position of the marker using the place ID and location.
            marker.setPlace(
                {placeId: localStorage.placeID, location: results[0].geometry.location});

            marker.setVisible(true);
        });

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();

        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

