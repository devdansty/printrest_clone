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

module.exports = router;
