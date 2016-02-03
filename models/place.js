var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var placeSchema = new mongoose.Schema({ 

	place_id : String,
	trip : {type: mongoose.Schema.ObjectId, ref: 'Trip'}
});



module.exports = mongoose.model("Place", placeSchema);