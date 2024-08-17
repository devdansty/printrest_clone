var express = require('express');
var router = express.Router();
var usermodel =require("./users");
const passport =require("passport");
const flash = require('connect-flash'); 

const mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/printrest_userdata');

const local_strategy = require("passport-local");

passport.use(new local_strategy(usermodel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("login");
});

router.get('/register', function(req, res, next) {
  res.render("index");
});


router.get('/login', function(req, res, next) {
  console.log(req.flash("error"));
  res.render("login");
});

router.post('/register', async function(req, res, next) {
  var user = await new usermodel({
    username: req.body.username,
    email: req.body.email ,
    fullname : req.body.fullname
  });
  usermodel.register(user, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect ("/profile");
    })
  })
});


router.get("/profile", IsLogedIn ,async function (req, res, next ){
  const user = await usermodel.findOne({
   username: req.session.passport.user
  });
 console.log(user);
 res.render("profile",{user});
});


router.post('/login', passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
}),function(req, res, next) {
});

router.get('/test', function(req, res) {
  req.flash('error', 'Test flash message');
  console.log(req.flash('error')); // This should log the flash message in the console
  res.send('Check your console!');
});


router.get('/feed', function(req, res, next) {
  res.render("feed");
});


router.get("/logout",function(req,res,){
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    res.redirect('/');
  });
});

function IsLogedIn(req,res,next){
  if(req.isAuthenticated()){ 
    return next();
  }
  else
  res.redirect("/");
}



module.exports = router;
