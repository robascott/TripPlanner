var User   = require('../models/user');
var Trip   = require('../models/trip');
var Place   = require('../models/place');

function showCreateTripForm(req,res) {

	res.render('newtrip', { message: req.flash('errorMessage') });


}

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
  removeTrip: removeTrip
}