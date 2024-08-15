var express = require('express');
var router = express.Router();
var usermodel =require("./users");
const passport =require("passport");


const local_strategy = require("passport-local");
passport.authenticate(new local_strategy(usermodel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/profile",islogedin,async function (res, res,next ){
  res.render('index', { title: ' Profie ' });
})


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

router.post('/login', passport.authenticate("local",{
  successRedirect:"/profie",
  failureRedirect:"/"
}),async function(req, res, next) {

});

router.get("/logout",function(req,res,){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function islogedin(req,res,next){
  if(req.isAuthenticated())
    return(next);
  res.redirect("/");
}



module.exports = router;
