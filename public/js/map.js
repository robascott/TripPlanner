$(init);

var currentTrip;

function init(){
  $(".confirm-dest-button").on("click", newTrip);

  var moveLeft = 20;
  var moveDown = 10;

  $("body").on('mouseenter', ".place-hours-label", function(event) {
    $(this).next().show();
  }).on('mouseleave', ".place-hours-label", function( event ) {
    $(this).next().hide();
  });


  $("body").on("click", ".add-place-button", addPlace);
  $("body").on("click", ".remove-place-button", removePlace);

}


function addPlace() {
  var selectedAddButton = $(this);
  var selectedPlaceId = selectedAddButton.data('place-id');

  $.ajax({
    url: '/trips/' + currentTrip + '/places',
    type: 'post',
    data: { place: {
      "place_id": selectedPlaceId,
      "trip": currentTrip
      }
    }
  }).done(function(place) {
    
    selectedAddButton.parent().toggleClass('added-place');
    selectedAddButton.toggleClass('hidden-button');

    var removePlaceButton = $(".remove-place-button[data-place-id='" + selectedPlaceId + "']");
    removePlaceButton.data('place-db-id', place._id);
    removePlaceButton.toggleClass('hidden-button');

  });
}


function removePlace() {
  var selectedRemoveButton = $(this);

  var selectedPlaceDbId = selectedRemoveButton.data('place-db-id');
  var selectedPlaceId = selectedRemoveButton.data('place-id');

  $.ajax({
    url: '/trips/' + currentTrip + '/places/' + selectedPlaceDbId,
    type: 'delete'
  }).done(function(place) {

    selectedRemoveButton.parent().toggleClass('added-place');
    selectedRemoveButton.toggleClass('hidden-button');

    var addPlaceButton = $(".add-place-button[data-place-id='" + selectedPlaceId + "']");
    addPlaceButton.toggleClass('hidden-button');

  });
}


var markers = [];



function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.5072, lng: -0.1275},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    styles: [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f0df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#d4e9b6"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c3e2aa"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#c9bfd1"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#B3CADD"}]}]
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


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

function getLat() {
	return markers[0].position.lat();
}

function getLng() {
	return markers[0].position.lng();
}



// GET STRING TITLE FROM GOOGLE AUTOCOMPLETE OBJECT

function getTitle() {
  return markers[0].title;
}


function newTrip() {
  getNearbyPlaces("new",getLat(),getLng());
  $("#edit-trip-div").show();
}

//var service;

function getNearbyPlaces(mode,lat,lng) {

  viewMode = mode;

  $("#search-div").hide();
  $('.confirm-dest-button').remove();

  // Calling function to create trip once the user clicks confirm destination button
  if (mode=='new') {
    createTrip();
  }

	var dest = {lat: lat, lng: lng}; 

	// 'service' shouldn't be global
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: dest,
    radius: 500,
    types: ['amusement_park','aquarium','art_gallary','church','museum','park','stadium','zoo']
  }, callback);
}


// CREATING TRIP WITH INFO FROM GOOGLE AUTOCOMPLETE

function createTrip() {
  event.preventDefault();
  var currentUserId = getCurrentUserId();

  $.ajax({
    url: '/trips',
    type: 'post',
    data: { trip: {
      "destination": getTitle(),
      "longitude" : getLng(),
      "latitude" : getLat(),
      "user" : currentUserId
    }
    }
    }).done(function(trip) {
      currentTrip = trip._id;
      $('#done-button').data('trip-id',trip._id)
      $("#trips-list").empty();
      populateTripsList();
    });
}

function createTiles(places,placeIds) {

  var tileContent = "<div class='row'>";

  // Add skeleton
  for (i=0; i<places.length; i++) {

    tileContent += "<div class='col-xs-4 suggestion-tile' data-grid-id='" + i + "'>";

    tileContent += "<h3 class='place-name' data-grid-id='" + i + "'></h3>";

    tileContent += "<div class='place-photo' data-grid-id='" + i + "'></div>";

    tileContent += "<p class='place-vicinity' data-grid-id='" + i + "'></p>";

    tileContent += "<p class='place-rating' data-grid-id='" + i + "'></p>";

    tileContent += "<a class='place-website' data-grid-id='" + i + "' target='_blank'></a><br>";

    // closing tile div
    tileContent += "</div>";

    if ((((i+1) % 3) == 0 )) {
      tileContent += "</div><div class='row'>";
    }

  }

  if (viewMode == "edit" || viewMode == 'new') {
    $("#edit-trip-content").append(tileContent);
  } else {
    $("#show-trip-content").append(tileContent);
  }
  

  for (i = 0; i < places.length; i++) {

    // add delay to this
    var service = new google.maps.places.PlacesService(map);
    service.getDetails(places[i], (function(j) { return function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }

      var tileContent = "";

      $(".place-name[data-grid-id='" + j + "']").text(result.name);

      var place_id = result.place_id

      var photos = result.photos
      if(typeof photos !== 'undefined'){
        var photo = photos[0].getUrl({'maxWidth': 250, 'maxHeight': 300});
        $(".place-photo[data-grid-id='" + j + "']").css('background-image', "url('" + photo + "')");
      } else {
        $(".place-photo[data-grid-id='" + j + "']").css('background-image', "url('http://i.imgur.com/DwMWyOB.png')");
        
      }

      $(".place-photo[data-grid-id='" + j + "']").css('background-size', 'cover');
      $(".place-photo[data-grid-id='" + j + "']").css('height', '200px');
      $(".place-photo[data-grid-id='" + j + "']").css('width', '100%');

      var vicinity = result.vicinity;
      if(typeof vicinity !== 'undefined'){
        $(".place-vicinity[data-grid-id='" + j + "']").text(vicinity);
      }

      var rating = result.rating;
      if(typeof rating !== 'undefined'){
        $(".place-rating[data-grid-id='" + j + "']").text("Rating: " + rating);
      }

      var website = result.website;
      if(typeof website !== 'undefined'){
        $(".place-website[data-grid-id='" + j + "']").text('Website');
        $(".place-website[data-grid-id='" + j + "']").attr('href',website);
      }

      
      var openingHours = result.opening_hours

      if(typeof openingHours !== 'undefined'){
        var hoursHTML = "<a href='#' class='place-hours-label' data-grid-id='" + j + "'>Opening Hours</a>";

        hoursHTML += "<div class='place-hours-pop-up'>";

        openingHours.weekday_text.forEach(function(day) {
          hoursHTML += "<p>" + day + "</p>";
        });

        hoursHTML += "</div>";

        $(".place-website[data-grid-id='" + j + "']").after(hoursHTML);

      }

      if (viewMode=='edit') {
        var placeMapIds = []; 

        placeIds.forEach(function(place) {  // placeIds == [{mapsId: dsfsdfg, dbId: sdfadgadf}, {mapsId: afdgsfdg, dbId: adfafg}, ...]
          placeMapIds.push(place.mapsId);
        });

        var index2 = placeMapIds.indexOf(place_id); // index if suggestion already saved in database


        if (index2 > -1) {
          $(".suggestion-tile[data-grid-id='" + j + "']").toggleClass('added-place');

          var addButton = "<input type='button' class='add-place-button hidden-button' data-place-id='" + place_id + "'value='Add'>"
          var removeButton = "<input type='button' class='remove-place-button' data-place-id='" + place_id + "' data-place-db-id='" + placeIds[index2].dbId + "' value='Remove'>";
        
        } else {

          var addButton = "<input type='button' class='add-place-button' data-place-id='" + place_id + "'value='Add'>"
          var removeButton = "<input type='button' class='remove-place-button hidden-button' data-place-id='" + place_id + "' value='Remove'>";

        }
        
      } else if (viewMode == 'new') {

        var addButton = "<input type='button' class='add-place-button' data-place-id='" + place_id + "'value='Add'>"
        var removeButton = "<input type='button' class='remove-place-button hidden-button' data-place-id='" + place_id + "'value='Remove'>";

      }

      $(".suggestion-tile[data-grid-id='" + j + "']").append(addButton);
      $(".suggestion-tile[data-grid-id='" + j + "']").append(removeButton);


    }})(i));
        
  }

}


function getTrip(places) {

  var placeIds = [];
  $.ajax({
    url: '/trips/' + currentTrip,
    type: 'get',
  }).done(function(data) {
    var placesArray = data.placesArray;
    placesArray.forEach(function(place) {
      //placeIds.push(place.place_id);
      placeIds.push({mapsId: place.place_id, dbId: place._id});
    });
    createTiles(places,placeIds)
  });

  
}


function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {

    getTrip(results.slice(0, 9));

  }
}









