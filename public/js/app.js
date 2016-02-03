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
		url: 'http://localhost:3000/trips/56b1d9034ca3fb2942c2415b',
		type: 'delete',
	}).done(function(){
		console.log('deleted')
	});
}

