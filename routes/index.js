var express = require('express');
var router = express.Router();
var usermodel =require("./users");
var postmodel =require("./post");
const passport =require("passport");
const flash = require('connect-flash'); 
const upload =require("./multer")
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
  }).populate("posts");
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



router.post('/upload',IsLogedIn,upload.single("file")  , async function(req, res, next) {
  if (!req.file){
    return res.status(400).send("NO files uploaded.")
  }
  else{
  //sab se pehly user nikalna ha 
  const Acc = await usermodel.findOne({username: req.session.passport.user});

  //ab hm post bnai gy
  const post =await postmodel.create({
    image: req.file.filename,
    caption:req.body.caption,
    user:Acc._id

  });
  //ab user k ander post ki id savekrwa deni ha
 Acc.posts.push(post._id);
 await Acc.save();
 console.log("post bngia ha ");

 //ab user k post k array mein post ki idsave ho gyi ha 
 res.render("profile", { user: Acc, posts: Acc.posts });

    console.log("Post created successfully.");
}

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

function IsLogedIn(req,res,next){ ////delete
  if(req.isAuthenticated()){ 
    return next();
  }
  else
  res.redirect("/");
}



module.exports = router;
