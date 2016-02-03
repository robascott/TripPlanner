$(init);

function init(){

  $("#deleteUser").on("click", getUserForDelete);

}	



function getUserForDelete() {
	var user = getCurrentUserIdForNav()
	// console.log(user);
	userid = 'http://localhost:3000/users/'+ user;
	// console.log(userid);
	
	$.ajax({
		url: userid,
		type: 'delete',
	}).done(function(){
		localStorage.clear();
		window.location= "/login";
	});
}



