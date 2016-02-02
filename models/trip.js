var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var tripSchema = new mongoose.Schema({ 

	destination: { type: String, required: true },
	longitude : { type: Number, required: true},
	latitude : { type: Number, required: true},
	places: [{type: mongoose.Schema.ObjectId, ref: 'Place'}],
	user : {type: mongoose.Schema.ObjectId, ref: 'User'}

});


tripSchema.pre('remove', function(next){

	console.log("GOT TO LINE 17");
	console.log(this.model);
    this.model('User').update(
        {_id: {$in: this.users}}, 
        {$pull: {trips: this._id}}, 
        {multi: true},
        next
    );
});



module.exports = mongoose.model("Trip", tripSchema);