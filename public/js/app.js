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
	console.log("I'VE BEEN CLICKED");
	event.preventDefault();

	$.ajax({
		url: 'http://localhost:3000/trips/56b0ff41b5cdd2d736bffade',
		type: 'delete',
	}).done(function(){
		console.log('deleted')
	});
}

