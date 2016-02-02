var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var placeSchema = new mongoose.Schema({ 

	name : String,
	rating : Number,
	vicinity : String,
	website : String,
	photo : String,
	weekday_text : [],
	trip : {type: mongoose.Schema.ObjectId, ref: 'Trip'}
});



module.exports = mongoose.model("Place", placeSchema);