$(init);

function init(){
  checkForIdForNav();
  $("#logoutNav").on("click", removeId);
  // event listener for the the profile button
  $("#profileLink").on("click", openProfilePage);
  $("#plannerLink").on("click", openPlannerPage);
  $("#signupLink").on("click", openSignUpPage);
  $("#loginLink").on("click", openLoginPage);
  $('.navbar-toggle collapsed').dropdown();
}

function getCurrentUserIdForNav(){
	return localStorage.getItem('currentUserId')
}

function checkForIdForNav() {

	if(getCurrentUserIdForNav()) {

		$(".loggedOut").hide();
		$(".loggedIn").show();


	}
	else {
		
		$(".loggedOut").show();
		$(".loggedIn").hide();
	}

}

function removeId() {
	event.preventDefault();
	localStorage.clear();
	window.location= "/login";
}

// function for ajax to open the profile page via request
function openProfilePage() {
	window.location = '/users/'+ getCurrentUserIdForNav();
}

function openPlannerPage(){
	window.location = '/planner';
}

function openSignUpPage(){
	window.location = '/signup';
}

function openLoginPage(){
	window.location = '/login';
}























