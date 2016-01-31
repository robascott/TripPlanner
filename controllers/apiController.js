var User     = require('../models/user');
var secret   = require('../config/config').secret 
var jwt      = require('jsonwebtoken');


function showPlanner(req, res, next) {

	res.render('planner');

}

module.exports = {
  showPlanner: showPlanner
}