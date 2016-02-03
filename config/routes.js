var express  = require('express');
var router   = express.Router();
var passport = require("passport");

var usersController = require('../controllers/usersController');
var authenticationsController = require('../controllers/authenticationsController');
var apiController = require('../controllers/apiController');

var User   = require('../models/user');

router.route('/trips')
	.get(apiController.showCreateTripForm)
	.post(apiController.createTrip);

router.route('/trips/:id')
	.get(apiController.showTripSummary)
	.delete(apiController.removeTrip);

	

router.route('/trips/:id/places')
	.post(apiController.createPlace);


router.route('/users/:id/trips')
	.get(apiController.showTripsList);

router.get('/login', usersController.showLogin);
router.get('/signup', usersController.showSignup);
router.get('/planner', usersController.showPlanner);


router.post('/login', authenticationsController.login);
router.post('/signup', authenticationsController.register);

router.route('/users')
  .get(usersController.usersIndex)

router.route('/users/:id')
  .get(usersController.usersShow)
  .put(usersController.usersUpdate)
  .patch(usersController.usersUpdate)
  .delete(usersController.usersDelete)

module.exports = router