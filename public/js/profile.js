$(init);

function init(){
	// listens for click on the delete button
  	$("#deleteUser").on("click", getUserForDelete);
  	$("#editEmail").on("submit", editEmail);
}	


//this will grab the current user and delete
function getUserForDelete() {
	var user = getCurrentUserIdForNav()
	userid = 'http://localhost:3000/users/'+ user;
	// ajax request to delete the uses and clear the local storage
	$.ajax({
		url: userid,
		type: 'delete',
	}).done(function(){
		localStorage.clear();
		window.location= "/login";
	});
}

function editEmail() {
	var user = getCurrentUserIdForNav()
	userid = 'http://localhost:3000/users/'+ user;
	// ajax request to delete the uses and clear the local storage
	$.ajax({
		url: userid,
		type: 'put',
		data: {email: $('#updateEmailField').val()}
	}).done(function(res){
		console.log(res)
	});
}



