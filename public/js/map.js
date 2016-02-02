$(init);

function init(){
  $(".comfirm-dest-button").on("click", getNearbyPlaces);
}

var markers = [];    



function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
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

    printPos();
  });
  // [END region_getplaces]

}

function printPos() {
	console.log("Lat: " + markers[0].position.lat());
	console.log("Long: " + markers[0].position.lng());
}

function getLat() {
	return markers[0].position.lat();
}

function getLng() {
	return markers[0].position.lng();
}


function getNearbyPlaces() {
	// Coordinates of destination
  var lat = getLat();
	var lng = getLng();

	var dest = {lat: lat, lng: lng}; 

	// 'service' shouldn't be global
  service = new google.maps.places.PlacesService(map);
	  service.nearbySearch({
	    location: dest,
	    radius: 500
	    //types: ['store']
	  }, callback);
}

function callback(results, status) {
  console.log(results[0]);
  if (status === google.maps.places.PlacesServiceStatus.OK) {

    for (var i = 0; i < 5; i++) {

      service.getDetails(results[i], function(result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }

        var tileContent = "<div class='suggestion-tile'><h2>" + result.name + "</h2>";

        var photo = result.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});
        if(typeof photo !== 'undefined'){
          tileContent += "<img class='place-photo' src='" + photo + "'>";
        }

        var vicinity = result.vicinity;
        if(typeof vicinity !== 'undefined'){
          tileContent += "<p class='place-vicinity'>" + vicinity + "</p>";
        }

        var website = result.website;
        if(typeof website !== 'undefined'){
          tileContent += "<a class='place-website' href='" + website + "'>" + website + "</a>";
        }

        tileContent += "</div>"

        $("#suggestions").append(tileContent);

      });

    	
    }
  }
}






