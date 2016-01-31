$(init);

function init(){
  $("form").on("submit", submitForm);
  $(".logout-link").on("click", logout);
  $(".users-link").on("click", users);
  $(".login-link, .register-link, .users-link").on("click", showPage);
  hideErrors();
  checkLoginState();
}

function checkLoginState(){
  if (getToken()) {
    // nothing
  } else {
    return loggedOutState();
  }
}

function showPage() {
  event.preventDefault();
  var linkClass = $(this).attr("class").split("-")[0]
  $("section").hide();
  hideErrors();
  return $("#" + linkClass).show();
}

function submitForm(){
  event.preventDefault();

  var method = $(this).attr("method");
  var url    = "http://localhost:3000/api" + $(this).attr("action");
  var data   = $(this).serialize();

  return ajaxRequest(method, url, data, authenticationSuccessful);
}

function users(){
  event.preventDefault();
  return getUsers();
}



function logout(){
  event.preventDefault();
  removeToken();
  return loggedOutState();
}


function hideErrors(){
  return $(".alert").removeClass("show").addClass("hide");
}

function displayErrors(data){
  return $(".alert").text(data).removeClass("hide").addClass("show");
}



function loggedInState(){
  window.location.replace("/planner");
}

function loggedOutState(){
  if (window.location.pathname != "/login") {
    window.location.replace("/login");
  }
}

function authenticationSuccessful(data) {
  if (data.token) setToken(data.token);
  loggedInState();
}

function setToken(token) {
  return localStorage.setItem("token", token)
}

function getToken() {
  return localStorage.getItem("token");
}

function removeToken() {
  return localStorage.clear();
}

function setRequestHeader(xhr, settings) {
  var token = getToken();
  if (token) return xhr.setRequestHeader('Authorization','Bearer ' + token);
}

function ajaxRequest(method, url, data, callback) {
  return $.ajax({
    method: method,
    url: url,
    data: data,
    beforeSend: setRequestHeader,
  }).done(function(data){
    if (callback) return callback(data);
  }).fail(function(data) {
    displayErrors(data.responseJSON.message);
  });
}