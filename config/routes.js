var express  = require('express');
var router   = express.Router();
var passport = require("passport");

var usersController = require('../controllers/usersController');
var authenticationsController = require('../controllers/authenticationsController');
var apiController = require('../controllers/apiController');


//ROOT ROUTE
router.route('/')
  .get(usersController.redirectUser)


router.route("/login")
	.get(usersController.showLogin)

router.route("/signup")
	.get(usersController.showSignup)



// api/login or api/signup
router.post('/login', authenticationsController.login);
router.post('/signup', authenticationsController.signup);


router.get('/planner', apiController.showPlanner);

// router.route('/users')
//   .get(usersController.usersIndex)

// router.route('/users/:id')
//   .get(usersController.usersShow)
//   .put(usersController.usersUpdate)
//   .patch(usersController.usersUpdate)
//   .delete(usersController.usersDelete)

module.exports = router