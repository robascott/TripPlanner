$(init);


function init(){
  	
  //CHECKING LOCAL STORAGE TO MAKE SURE USER IS LOGGED IN
  checkForId();

  //LOADING TRIPS LIST FOR THE USER AS SOON AS HE/SHE LOGS IN
  populateTripsList();

  // ADDING EVENT LISTENERS TO BUTTONS 
  $("body").on("click", ".delete-trip-button", deleteTrip);
  $('#showTrips').on("click", showTrips);
  $('#show-trip-summary').on("click", showTrip);
  $("body").on("click", ".show-trip-link", selectTripFromList);

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



// PULLING DATA TO SHOW IN SINGLE TRIP WHEN CLICKING DONE 

function showTrip(data) { 

	$.ajax({
		url: 'http://localhost:3000/trips/' + currentTrip,
		type: 'get',
	}).done(function(data) {

		var destination = data.destination;
			var lng = data.longitude;
			var lat = data.latitude;
			var placesArray = data.placesArray;
			// console.log(placesArray);
			// console.log("running show trip");

	});
}


// PULLING DATA TO SHOW IN SINGLE TRIP WHEN SELECTING TRIP FROM TRIPS LIST

function selectTripFromList(data) {

	event.preventDefault();

	var tripId = $(this).data('trip-id');

		$.ajax({
			url: 'http://localhost:3000/trips/' + tripId,
			type: 'get',
		}).done(function(data) {

			var destination = data.destination;
			var lng = data.longitude;
			var lat = data.latitude;
			var placesArray = data.placesArray;
				
			console.log(destination, lng, lat, placesArray);

		});
	}




// PULLING DATA TO SHOW IN EDIT TRIP PAGE 

function editTrip(data) { 


	$.ajax({
		url: 'http://localhost:3000/trips/' + currentTrip,
		type: 'get',
	}).done(function(data) {

		var destination = data.destination;
			var lng = data.longitude;
			var lat = data.latitude;
			var placesArray = data.placesArray;
			// console.log(placesArray);
			// console.log("running show trip");

	});
}



// SHOWING LIST OF ALL TRIPS FOR CURRENT USER 

function showTrips() {

	event.preventDefault();

	$("#trips-list").fadeIn();
}



function populateTripsList() {

	event.preventDefault();

	$.ajax({
		url: 'http://localhost:3000/users/' + getCurrentUserId() + '/trips',
		type: 'get',
	}).done(function(data){
		
		var tripsListRow;

		for (i=0;i<data.length;i++) {


			tripsListRow = "<div class='trip-title' data-trip-id='" + data[i]._id + "'><a href='#' class='show-trip-link' data-trip-id='" + data[i]._id + "'><h2 style='display: inline'>" + data[i].destination + "</h2></a><input type='button' value='Edit trip' /><input type='button' class='delete-trip-button' data-trip-id='" + data[i]._id + "' value='Delete trip' /></div>";

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
		$("#trips-list").empty();
		populateTripsList();
	});
}

