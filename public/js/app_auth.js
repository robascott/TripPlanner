$(init);

function init(){
  $("#authFormLogin").on("submit", submitAuthFormLogin);
  $("#authFormSignUp").on("submit", submitAuthFormSignup);

  checkForId();
}	



function submitAuthFormLogin() {

	event.preventDefault();

	$.ajax ({
	 	url: 'http://localhost:3000/login',
	 	type: 'post',
	 	data: { 
			"email": $("input#email").val(),
			"password": $("input#password").val()	
	 	}
	}).done(setCurrentUserId, function() {

		console.log(checkForId());

	}) 
	
}


function submitAuthFormSignup() {

	event.preventDefault();

	$.ajax ({
	 	url: 'http://localhost:3000/signup',
	 	type: 'post',
	 	data: { 
			"email": $("input#email").val(),
			"password": $("input#password").val()	
	 	}
	}).done(setCurrentUserId, function() {

		console.log(checkForId());

	}) 
	
}

function setCurrentUserId(data) {
	localStorage.setItem("currentUserId", data.user._id)
}


function getCurrentUserId(){
	return localStorage.getItem('currentUserId')
}

function checkForId() {

	if(getCurrentUserId()) {

		window.location= "/planner";

	}
	else {
		console.log("No current user id found")
	}

}