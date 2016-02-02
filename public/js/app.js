$(init);

function init(){
  
  checkForId();

  $("form#newTripForm").on("submit", createTrip);
  $("#testDelete").on("click", deleteTrip)

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
		url: 'http://localhost:3000/trips',
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

function deleteTrip() {
	console.log("I'VE BEEN CLICKED");
	event.preventDefault();

	$.ajax({
		url: 'http://localhost:3000/trips/56b0ec7b7b2161e133082e02',
		type: 'delete',
	}).done(function(){
		console.log('deleted')
	});
}

