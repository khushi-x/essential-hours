// Your web app's Firebase configuration
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAjxFj4_JqT2xlit-uqfxHDSyJOzlZgFI0",
    authDomain: "test-1-7b3cd.firebaseapp.com",
    databaseURL: "https://test-1-7b3cd.firebaseio.com",
    storageBucket: "test-1-7b3cd.appspot.com",
};

firebase.initializeApp(config);
var database = firebase.database();

var dedicatedLocations = []
var dedicatedMarkers = []
dedicatedLocations = firebase.database().ref('locations').orderByChild('placeID;');
dedicatedLocations.on('value', function (snapshot) {
    for (var plc in snapshot.val()) {
        dedicatedLocations += plc;
    }
})


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

        var modStart = firebase.database().ref('locations/' + localStorage.placeID + '/ModStart');
        modStart.on('value', function (snapshot) {
            modStart = snapshot.val();
            console.log(modStart)
            if (snapshot.val() !== null) {
                $("#mod-start").text(modStart);
            } else {
                    $("#mod-start").text("");
                }
            })

        var modEnd = firebase.database().ref('locations/' + localStorage.placeID + '/ModEnd');
            modEnd.on('value', function (snapshot) {
                modEnd = snapshot.val();
                console.log(modEnd)
                if (snapshot.val() !== null) {
                    $("#mod-end").text(modEnd);
                } else {
                        $("#mod-end").text("")
                    }
                })

        if (places.length === 0) {
            return;
        }

        // for (var location in dedicatedLocations) {
        //     geocoder.geocode({'placeId': location}, function(results, status) {
        //         if (status !== 'OK') {
        //             console.log(location)
        //             window.alert('Geocoder failed due to: ' + status);
        //             return;
        //         }
        //
        //         // Set the position of the marker using the place ID and location.
        //
        //         // Create a marker for each place.
        //         dedicatedMarkers.push(new google.maps.Marker({
        //             map: map,
        //             icon: icon,
        //             title: results[0].name,
        //             position: results[0].geometry.location
        //         }));
        //     });
        // }
        // tbd , add markers from the list of stuff


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

function logHours(){
    console.log('enter')
     var starthour=document.querySelector("#add-mod-start").value;
     var endhour=document.querySelector("#add-mod-end").value;
     if (starthour !== null && endhour !== null) {
        firebase.database().ref('locations/' + localStorage.placeID).set({
            Identification: localStorage.placeID,
            Name: localStorage.placeName,
            Address: localStorage.placeAddress,
            ModStart: starthour,
            ModEnd: endhour,
        });
        console.log('done')
     }

}

/*
$("#save").click( function() {
//    var starthour=document.querySelector("#add-mod-start").value;
//   var endhour=document.querySelector("#add-mod-end").value;
    firebase.database().ref('locations/' + localStorage.placeID).set({
        Identification: localStorage.placeID,
        Name: localStorage.placeName,
        Address: localStorage.placeAddress,
//        ModStart: starthour,
//        ModEnd: endhour,
    });
    console.log('done')
})

*/