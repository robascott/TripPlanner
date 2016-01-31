var express        = require('express');
var path           = require('path');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var methodOverride = require("method-override");
var jwt            = require('jsonwebtoken');
var expressJWT     = require('express-jwt');
var ejs = require('ejs');
var ejsLayouts  = require('express-ejs-layouts');
var app            = express();

var config         = require('./config/config');
var secret         = require('./config/config').secret;

mongoose.connect(config.database);

require('./config/passport')(passport);

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// For restricting API access
app.use('/api', expressJWT({ secret: secret })
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/signup', methods: ['POST'] }
    ]
  }));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'Unauthorized request.'});
  }
  next();
});

// choose the name of the layout file
app.set('layout', 'layout'); // defaults to 'layout'

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts)
app.set('view engine', 'ejs');

/* 
   passport makes the user object accessible in every req request object
   so we make it global here so you can always access it
   hint it will also be available in your views directly as currentUser 
*/
app.use(function(req, res, next) {
  global.currentUser = req.user;
  next();
});


var routes = require('./config/routes');
app.use("/api", routes);
app.use(routes);





module.exports = app;

app.listen(3000);


