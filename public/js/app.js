$(init);

function init(){
  
  checkForId();

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



