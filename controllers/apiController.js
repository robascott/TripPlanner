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


module.exports = {
  showCreateTripForm: showCreateTripForm,
  createTrip: createTrip
}