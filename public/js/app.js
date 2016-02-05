$(init);

function init(){
  	
  //CHECKING LOCAL STORAGE TO MAKE SURE USER IS LOGGED IN
  checkForId();

  //LOADING TRIPS LIST FOR THE USER AS SOON AS HE/SHE LOGS IN
  populateTripsList();

  // ADDING EVENT LISTENERS TO BUTTONS 
  $("body").on("click", ".delete-trip-button", deleteTrip);
  $('#showTrips').on("click", showTrips);
  $('#done-button').on("click", showSingleTrip);
  $('#edit-trip-button').on('click', editTrip);
  $("body").on("click", ".show-trip-link", showSingleTrip);

  $("#edit-trip-div").hide();
  $("#show-trip-div").hide();

}


// GETTING CURRENT USER ID FROM LOCAL STORAGE.

function getCurrentUserId(){
	return localStorage.getItem('currentUserId');
}


// CHECKING IF THE USER HAS A VALID ID IN LOCAL STORAGE. IF NOT THE USER GETS REDIRECTED. 

function checkForId() {

	if(getCurrentUserId()) {
		console.log("You are logged in");
	} else {
		window.location= "/login";
	}

}

function editTrip() {
	showTrip('edit',$(this)); // second argument is clicked edit button
	$('#done-button').data('trip-id',currentTrip);
	$("#show-trip-content").empty();
	$("#show-trip-div").hide();
	$("#edit-trip-div").fadeIn();
}

function showSingleTrip() {
	showTrip('show', $(this)); // second argument is clicked trip name
	$("#edit-trip-content").empty();
	$("#edit-trip-div").hide();
	$("#show-trip-div").fadeIn();
	$("#trips-list").hide();
}



// PULLING DATA TO SHOW IN SINGLE TRIP WHEN CLICKING DONE 

var viewMode;

function showTrip(mode,clickedItem) {

	viewMode = mode;

	currentTrip = clickedItem.data('trip-id');
	
	$("#edit-trip-button").data('trip-id',currentTrip)

	$.ajax({
		url: '/trips/' + currentTrip,
		type: 'get',
	}).done(function(data) {

		var destination = data.destination;
		var placesArray = data.placesArray;
		var lat = data.latitude;
		var lng = data.longitude;

		$(".trip-destination").html("Your trip to " + destination);

		var placeIdsArray = [];

		placesArray.forEach(function(place) {
			placeIdsArray.push({placeId: place.place_id});
		});

		if (viewMode == 'show') {
			initSavedPlacesMap(lat,lng);
			getTrip(placeIdsArray);
		} else {
			getNearbyPlaces(mode,lat,lng);
		}

	});
}





// SHOWING LIST OF ALL TRIPS FOR CURRENT USER 

function showTrips() {
	$("#edit-trip-content").empty();
	$("#show-trip-content").empty();

	$("#edit-trip-div").hide();
	$("#show-trip-div").hide();
	$("#search-div").hide();

	$("#trips-list").fadeIn();
}



function populateTripsList() {

	event.preventDefault();

	$.ajax({
		url: '/users/' + getCurrentUserId() + '/trips',
		type: 'get',
	}).done(function(data){
		
		var tripsListRow;

		$("#trips-list").append($("<h1>All trips</h1>"));


		for (i=0;i<data.length;i++) {

			tripsListRow = "<div class='trip-title' data-trip-id='" + data[i]._id + "'><a href='#' class='show-trip-link' data-trip-id='" + data[i]._id + "' style='text-decoration: none'><h2 class='trip-title-name' style='display: inline-block'>" + data[i].destination + "</h2></a><input type='button' class='delete-trip-button' data-trip-id='" + data[i]._id + "' value='✖'></div>";

			$("#trips-list").append(tripsListRow);

			$(".trip-title[data-trip-id='" + data[i]._id + "']").css('background-image', "url('https://maps.googleapis.com/maps/api/staticmap?center=" + data[i].destination + "&zoom=13&size=900x200&maptype=roadmap&key=AIzaSyDiCc-BJ1GrJsQCnlq5mCV1lxjoT2DTbeg')");
			$(".trip-title[data-trip-id='" + data[i]._id + "']").css('background-size', 'cover');
			$(".trip-title[data-trip-id='" + data[i]._id + "']").css('height', '200px');
			$(".trip-title[data-trip-id='" + data[i]._id + "']").css('width', '100%');

		}

	});

}


// FUNCTION TO DELETE TRIP

function deleteTrip() {

	event.preventDefault();

	var tripId = $(this).data('trip-id');
	var singleTripDiv = $(".trip-title[data-trip-id='" + tripId + "']").remove();

	$.ajax({
		url: '/trips/' + tripId,
		type: 'delete',
	}).done(function(){
		$("#trips-list").empty();
		populateTripsList();
	});
}

