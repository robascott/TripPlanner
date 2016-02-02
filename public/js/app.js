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

