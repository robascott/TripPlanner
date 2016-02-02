var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({ 
  local: {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  },
  trips: [{type: mongoose.Schema.ObjectId, ref: 'Trip'}]
});

userSchema.statics.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model("User", userSchema);