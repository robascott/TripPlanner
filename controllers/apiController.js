var User   = require('../models/user');
var Trip   = require('../models/trip');
var Place   = require('../models/place');

function showCreateTripForm(req,res) {

	res.render('newtrip', { message: req.flash('errorMessage') });


}


// FUNCTION TO CREATE A TRIP AND PUSH IT TO THE USERS's TRIPS ARRAY // 

function createTrip(req,res) {

	var trip = new Trip(req.body.trip);
	trip.save(function(err, trip) {
		if(err) return res.status(500).send(err);

		var userId = req.body.trip.user;
		User.findOne({ _id : userId} , function(err, user) {
			user.trips.push(trip._id);
			user.save();
		});
		res.status(201).send(trip);
	})
}




// FUNCTION TO CREATE A PLACE AND PUSH IT TO THE TRIP's PLACES ARRAY // 

function createPlace(req,res) {

	var place = new Place(req.body.place);
	place.save(function(err, place) {
		if(err) return res.status(500).send(err);

		var tripId = req.body.place.trip;
		Trip.findOne({ _id : tripId} , function(err, trip) {
			trip.places.push(place._id);
			trip.save();
		});
		res.status(201).send(place);

	})
}




// PULLING FROM DB LIST OF PLACES THAT BELONG TO A TRIP

function showTripSummary(req,res) {

	var id = req.params.id;

	Trip.findOne({_id: id}).populate('places').exec(function(err, trip) {

		if (err) return res.status(500).send(err);

		var newTripObject = { 

			destination : trip.destination,
			longitude   : trip.longitude,
			latitude    : trip.latitude,
			placesArray : trip.places
		}

		res.status(200).send(newTripObject);

	})
}




// SHOW LIST OF TRIPS FOR LOGGED IN USER

function showTripsList(req,res) {

	var id = req.params.id;

	console.log(id);
	
	User.findOne({ _id: id}).populate('trips').exec(function(err, user) {

		if (err) return res.status(500).send(err);
		res.status(200).send(user.trips);

	})
}





// FUNCTION TO REMOVE A SINGLE TRIP THE TRIP


function removeTrip(req,res) {

	var id = req.params.id;

	Trip.findOne({ _id: id}, function(err, trip) {
		console.log(trip);
		trip.remove();
		
		if (err) return res.status(500).send(err);
		res.status(200).send();

	})	
}






module.exports = {
  showCreateTripForm: showCreateTripForm,
  createTrip: createTrip,
  removeTrip: removeTrip,
  showTripsList : showTripsList,
  createPlace : createPlace,
  showTripSummary : showTripSummary
}