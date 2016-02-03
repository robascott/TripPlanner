var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var tripSchema = new mongoose.Schema({ 

	destination: { type: String, required: true },
	longitude : { type: Number, required: true},
	latitude : { type: Number, required: true},
	places: [{type: mongoose.Schema.ObjectId, ref: 'Place'}],
	user : {type: mongoose.Schema.ObjectId, ref: 'User'}

});


// MIDDLEWARE TO REMOVE THE REFERENCE TO THE DELETED TRIP FROM THE USER'S TRIPS ARRAY

tripSchema.pre('remove', function(next){

	console.log("GOT TO LINE 17");
	console.log(this._id);
	console.log(this.user);

    this.model('User').update(
        {_id: this.user}, 
        {$pull: {trips: this._id}}, 
        {multi: true},
        function(err, numAffected) {
        	console.log("DID IT GET TO HERE? LINE 28");
    		console.log(err);
    		console.log(numAffected);
    		next()
        }
    );

    
});



module.exports = mongoose.model("Trip", tripSchema);