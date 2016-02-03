$(init);


function init(){
  	
  //CHECKING LOCAL STORAGE TO MAKE SURE USER IS LOGGED IN
  checkForId();

  // ADDING EVENT LISTENERS TO BUTTONS 
  $("body").on("click", ".delete-trip-button", deleteTrip);
  $('#showTrips').on("click", showTrips);
  $('#show-trip-summary').on("click", getSavedPlaces);

}	


// GETTING CURRENT USER ID FROM LOCAL STORAGE.

function getCurrentUserId(){
	return localStorage.getItem('currentUserId');
}


// CHECKING IF THE USER HAS A VALID ID IN LOCAL STORAGE. IF NOT THE USER GETS REDIRECTED. 

function checkForId() {

	if(getCurrentUserId()) {
		console.log("You are indeed logged in");
	}

	else {
		window.location= "/login";
	}

}



// SHOWING SELECTED PLACES FOR A SINGLE TRIP

function showTrip(data) { 

	var destination = data.destination;
	var lng = data.longitude;
	var lat = data.latitude;
	var placesArray = data.placesArray;

	console.log("running show trip");
	console.log(destination, lng, lat, placesArray);

}



// SHOWING TRIP SUMMARY WHEN USER HAS FINISHED ADDING PLACES 

function getSavedPlaces() {

	event.preventDefault();

	$.ajax({
		url: 'http://localhost:3000/trips/' + currentTrip,
		type: 'get',
	}).done(function(data) {

		showTrip(data);

	});
}



// SHOWING LIST OF ALL TRIPS FOR CURRENT USER 

function showTrips() {

	event.preventDefault();

	$.ajax({
		url: 'http://localhost:3000/users/' + getCurrentUserId() + '/trips',
		type: 'get',
	}).done(function(data){
		
		var tripsListRow;

		for (i=0;i<data.length;i++) {


			tripsListRow = "<div class='trip-title' data-trip-id='" + data[i]._id + "'><h2 style='display: inline'>" + data[i].destination + "</h2><input type='button' value='Edit trip' /><input type='button' class='delete-trip-button' data-trip-id='" + data[i]._id + "' value='Delete trip' /></div>";

			$("#trips-list").append(tripsListRow);

		}


	});
}



// FUNCTION TO DELETE TRIP

function deleteTrip() {

	event.preventDefault();

	var tripId = $(this).data('trip-id');
	var singleTripDiv = $(".trip-title[data-trip-id='" + tripId + "']").remove();

	$.ajax({
		url: 'http://localhost:3000/trips/' + tripId,
		type: 'delete',
	}).done(function(){
		console.log('deleted')
	});
}

