$(init);

function init(){
  
  checkForId();

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

// TESTING FUNCTION TO DELETE TRIP (WORKS ON NEWTRIP.EJS)

function deleteTrip() {

	event.preventDefault();

	$.ajax({
		url: 'http://localhost:3000/trips/56b1cc103023da333d8d04e6',
		type: 'delete',
	}).done(function(){
		console.log('deleted')
	});
}

