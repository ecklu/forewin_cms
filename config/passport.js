var passport = require('passport')
var User = require('../models/user')
var LocalStrategy = require('passport-local').Strategy; //to store authentication details locally within the server


//how to store the user in the session(serialize)
passport.serializeUser(function(user, done){
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    })
 });

//Creating a new user signup
 passport.use('local.signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
 }, function(req, email, password, done){
    //checking if emaiil is not empty and is actally a email
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();

    //checking if password is not empty and its length
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});

    //handling errors usig the validationErrors function
    var errors = req.validationErrors()
     //pushing the errors to the view
     if(errors){
        var messages = []
        errors.forEach(function(error){
        messages.push(error.msg)//the msg is a validator property
        })
        return done(null, false, req.flash('error', messages))
     }


        //finding the user
     User.findOne({'email' : email}, function(err, user){
            if(err){
                return done(err)
            }
            if(user){
                    //the false means not sucessful beacause there is an email saved
                return done(null, false, {message: 'email already exist'})
            }

            //inserting or creating a new user
            var newUser = new User()
            newUser.email = email;
            
            newUser.password = newUser.encryptPassword(password);//encryptPassword coming from the user model

            newUser.save(function(err, result){
                if(err){
                return done(err)
                }
                return done(null, newUser);
            })

        })

 }))


 //creating a user signin
 passport.use('local.signin', new LocalStrategy({
       usernameField : 'email',
       passwordField : 'password',
       passReqToCallback: true
 },function(req,email,password,done){
    //checking if emaiil is not empty and is actally a email
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();

        //checking if password is not empty
        req.checkBody('password', 'Invalid password').notEmpty();

        //handling errors usig the validationErrors function
        var errors = req.validationErrors()
         //pushing the errors to the view
         if(errors){
            var messages = []
            errors.forEach(function(error){
            messages.push(error.msg)//the msg is a validator property
            })
            return done(null, false, req.flash('error', messages))
         }

    User.findOne({'email' : email}, function(err, user){
        console.log(' signed in')
                    if(err){
                        return done(err)
                    }
                    //if no user found
                    if(!user){
                            //the false means not sucessful beacause there is an email saved
                         
                        return done(null, false, {message: 'No user found'})
                        
                    }
                    //checking if password is valid using validPassword() from user models
                    if(!user.validPassword(password)){
                        //the false means not sucessful beacause no user is found
                        return done(null, false, {message: 'Wrong password'})
                    }
                return done(null, user)

                })
 }))