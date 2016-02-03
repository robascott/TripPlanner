var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var placeSchema = new mongoose.Schema({ 

	place_id : String,
	trip : {type: mongoose.Schema.ObjectId, ref: 'Trip'}
});


// MIDDLEWARE TO REMOVE THE REFERENCE TO THE DELETED PLACE FROM THE TRIP'S PLACES ARRAY

placeSchema.pre('remove', function(next){

    this.model('Trip').update(
        {_id: this.trip}, 
        {$pull: {places: this._id}}, 
        {multi: true},
        function(err, numAffected) {
    		next();
        }
    );
    
});


module.exports = mongoose.model("Place", placeSchema);
