$(init);

function init(){
  checkForIdForNav();
  $("#logoutNav").on("click", removeId);
  // event listener for the the profile button
  $("#profileLink").on("click", openProfilePage)
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
	window.location = 'http://localhost:3000/users/'+ getCurrentUserIdForNav();
}























