var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var tripSchema = new mongoose.Schema({ 

	destination: { type: String, required: true },
	longitude : { type: Number, required: true},
	latitude : { type: Number, required: true},
	places: [{type: mongoose.Schema.ObjectId, ref: 'Place'}],
	user : {type: mongoose.Schema.ObjectId, ref: 'User'}

});


module.exports = mongoose.model("Trip", tripSchema);