var User   = require('../models/user');

function showLogin(req,res) {
    res.render('login', { message: req.flash('errorMessage') });
}

function showSignup(req,res) {
   res.render('signup', { message: req.flash('errorMessage') });
}

function showPlanner(req,res) {
  res.render('planner');
}

function usersIndex(req, res) {
  User.find(function(err, users){
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.status(200).json({ users: users });
  });
}

// When clicks on profile link it will go through here
function usersShow(req, res){
  User.findById(req.params.id, function(err, user){
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.render('profile', {user: user});
  });
}

function usersUpdate(req, res){

  console.log(req.body.email);
  User.findByIdAndUpdate({ _id: req.params.id }, {'local.email': req.body.email}, {new: true}, function(err, user){
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send(err);

    res.status(200).send(user);
  });  

  // User.findById(req.params.id,  function(err, user) {
  //   if (err) return res.status(500).json({message: "Something went wrong!"});
  //   if (!user) return res.status(404).json({message: 'No user found.'});
  //   console.log(req.body.email)
  // //   if (req.body.email) user.local.email = req.body.email;

  //   user.save(function(err) {
  //    if (err) return res.status(500).json({message: "Something went wrong!"});

  //     res.status(201).json({message: 'User successfully updated.', user: user});
  //   });
  // });
}

// this is called when you press the delete button in profile
function usersDelete(req, res){
  User.findByIdAndRemove({_id: req.params.id}, function(err){
   if (err) return res.status(404).json({message: 'Something went wrong.'});
   res.status(200).json({message: 'User has been successfully deleted'});
  });
}

module.exports = {
  usersIndex:  usersIndex,
  usersShow:   usersShow,
  usersUpdate: usersUpdate,
  usersDelete: usersDelete,
  showLogin: showLogin,
  showSignup: showSignup,
  showPlanner: showPlanner
}