$(init);

function init(){
  
  checkForId();

  $("form#newTripForm").on("submit", createTrip);

}	


function getCurrentUserId(){
	return localStorage.getItem('currentUserId');
}

function checkForId() {

	if(getCurrentUserId()) {
		console.log("You are indeed logged in");
	}

	else {
		window.location= "/login";
	}

}

function createTrip() {
	event.preventDefault();
	var currentUserId = getCurrentUserId();

	$.ajax({
		url: 'http://localhost:3000/createtrip',
		type: 'post',
		data: { trip: {
			"destination": $("input#destination").val(),
			"longitude" : $("input#longitude").val(),
			"latitude" : $("input#latitude").val(),
			"user" : currentUserId
		}
		}
		}).done(function(trip) {
			console.log(trip);

		});
}

