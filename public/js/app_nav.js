$(init);

function init(){
  checkForIdForNav();
  $("#logoutNav").on("click", removeId);
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