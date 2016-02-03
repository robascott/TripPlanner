$(init);

// var tripId;

function init(){
  	
  checkForId();

  $("#testDelete").on("click", deleteTrip);
  $('#showTrips').on("click", showTrips);

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


// FUNCTION 

function showTrips() {

	event.preventDefault();

	$.ajax({
		url: 'http://localhost:3000/users/' + getCurrentUserId() + '/trips',
		type: 'get',
	}).done(function(data){
		
		var tripsListRow;

		for (i=0;i<data.length;i++) {


			tripsListRow = "<div><h2 style='display: inline'>" + data[i].destination + "</h2><input type='button' value='Edit trip' /><input type='button' value='Delete trip' /></div>";

			$("#trips-list").append(tripsListRow);

		}


	});
}


// TESTING FUNCTION TO DELETE TRIP (WORKS ON NEWTRIP.EJS)

function deleteTrip() {

	event.preventDefault();

	$.ajax({
		url: 'http://localhost:3000/trips/56b1d9034ca3fb2942c2415b',
		type: 'delete',
	}).done(function(){
		console.log('deleted')
	});
}

