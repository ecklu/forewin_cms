var express = require('express');
var router = express.Router();
var csrf = require('csurf')
var passport = require('passport')

//setting up the protection for csurf
var csrfProtection = csrf();

//protecting my routes using csurf protection
router.use(csrfProtection)

router.get('/',isLoggedIn, function(req,res,next){
 
  res.render('index')

})

//logging out
router.get('/logout',isLoggedIn, function(req,res,next){
  req.logout();
  res.redirect('/user/signin')
})

//opposing to get and post request for not loggin
router.use('/user/signin', notLoggedIn, function(req,res,next){
  next();
})

/*Signup page*/
router.get('/signup',function(req,res){
  //obtain possible flash messages and store into error
  var messages = req.flash('error')

                  //Sending csurf token to the browser    //passing msg to view       //if there is no message
  res.render('user/register', {csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0})//need express-session to able to send token
})

//appling the local strategy for the signup
router.post('/signup', passport.authenticate('local.signup',{
  successRedirect: '/user/signup',
  failureRedirect: '/user/signup',
  failureFlash: true
}))

router.get('/signin',function(req,res,next){
  //obtain possible flash messages and store into error
     var messages = req.flash('error')
 
                     //Sending csurf token to the browser    //passing msg to view       //if there is no message
     res.render('user/login', {csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0})//need express-session to able to send token
 
 })
 
 //appling the local strategy for the signup
 router.post('/signin',passport.authenticate('local.signin',{
     successRedirect: '/',
     failureRedirect: '/user/signin',
     failureFlash: true
 }))
 

module.exports = router;

//checking if user is login (middleware)
function isLoggedIn(req,res,next){
  //checking authentication using isAuthenticated() provided by passport
  if(req.isAuthenticated){
      return next()
  }
  res.redirect('/user/signin')

}

//checking if user not login (middleware)
function notLoggedIn(req,res,next){
  //checking authentication using isAuthenticated() provided by passport
  if(!req.isAuthenticated()){
      return next();
  }
  res.redirect('/user/signin')
}

