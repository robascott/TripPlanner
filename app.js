var express        = require('express');
var cors           = require('cors');
var path           = require('path');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var cookieParser   = require("cookie-parser");
var methodOverride = require("method-override");
var jwt            = require('jsonwebtoken');
var expressJWT     = require('express-jwt');
var flash          = require('connect-flash');
var ejsLayouts     = require('express-ejs-layouts');
var session        = require('express-session');
var sass           = require('node-sass-middleware');
var app            = express();


var config         = require('./config/config');
var User           = require('./models/user');
var secret         = require('./config/config').secret;

mongoose.connect(config.database);

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
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
app.use(ejsLayouts);

app.use(sass({
src: path.join(__dirname, '/src'),
dest: path.join(__dirname, '/public'),
debug: true,
outputStyle: 'compressed'
}));


app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(session({ secret: 'WDI-GENERAL-ASSEMBLY-EXPRESS' })); 
app.use(passport.initialize());
// app.use(passport.session()); 
app.use(flash()); 


// Protecting your api routes with JWT
// app.use('/api', expressJWT({secret: secret})
//   .unless({
//     path: [
//       { url: '/api/login', methods: ['POST'] },
//       { url: '/api/register', methods: ['POST'] },
//       { url: '/api/login', methods: ['GET'] },
//       { url: '/api/register', methods: ['GET'] }

//     ]
// }));



// Making error messages nicer
app.use(function (err, req, res, next) {

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: "Need token to access"});
  }
  next();
});


app.use(function(req, res, next) {

  User.findOne({'local.email': req.body.email}, function(err, user) {

   global.currentUser = user;
   // console.log(global.currentUser);
   // console.log(global.currentUser.id);

  });

  next();

});


var routes = require('./config/routes');
app.use("/", routes);

app.listen(process.env.PORT || 3000 )


