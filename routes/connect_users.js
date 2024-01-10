var express = require('express');
var router = express.Router();
//var path = require("path")
var multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

var Users = require('../models/connect_users')

//setting up my file storage
var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./public/upload/')
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname)
    }
  })
  var upload = multer({storage:storage})

  
  router.get('/connect_users',function(req,res){
    res.render('pages/forms/connect_user')
  })
  
  router.post('/connect_users',upload.single('execfile'),function(req,res){
    Users.find({email:req.body.email})
    .exec()
    .then(user =>{
      if(user.length >= 1){
        console.log("email exist")
      }else{

        bcrypt.hash(req.body.password,10,(err,hash)=>{
          if(err){
            console.log(err)
          }else{
            const user = new Users({
              name :req.body.name,
              phoneNumber : req.body.phoneNumber,
              gender : req.body.gender,
              email :req.body.email,
              surveyLocation : req.body.location,
              //filepic : req.file.path.toString().replace('public',''),
              password: hash,
              isActive:false

            })

            user.save()
            .then(result=>{
              console.log(result)
              console.log("post of user sent")
              res.redirect('/users/connect_users')
            })
            .catch(err=>{
              console.log(err)
            })
          }
        })

      }

    })
    
  })

  
  
 router.get('/users_table',function(req,res){


    Users.find({}).lean()
    .then(users => {
      
        res.render('pages/tables/connect_users_t', {
             users:users
         
            })
           });
  
  })

  /*router.get('/users_table',function(req,res){
  res.render('pages/tables/connect_users_t');
  
  })*/

  router.get('/connect/edit/:id',(req,res)=>{
    let id = req.params.id;
    Users.findById({_id:id}).lean()
    .then((data)=>{
      console.log("edit data",data)
      res.render("pages/forms/connect_user_edit",{user_data:data})
    })

   
  })

  router.post('/users_connect/edit/:id',upload.single('execfile'),(req,res)=>{
    //console.log('Editing done')
    console.log('editing working')
    let connectUsers = {}
   
    connectUsers.name = req.body.name;
    connectUsers.phoneNumber = req.body.phoneNumber;
    connectUsers.gender = req.body.gender;
    connectUsers.email = req.body.email;
    connectUsers.surveyLocation = req.body.location;
    //connectUsers.filepic = req.file.path.toString().replace('public','');
   // console.log("Testing link",surveyUsers.filepic)
      
    let query = {_id:req.params.id}
    Users.updateOne(query,connectUsers, function(err){
        if(err){
          console.log(err)
          return;
        }else{
          console.log('Edited Succesfully')
          
          res.redirect('/users/users_table')
        }
      })

  })
  
  router.get('/connect/delete/:id',(req,res)=>{
    var query = req.params.id

    Users.findByIdAndRemove(query, function(err){
      if(err){
        console.log(err)
        return;
      }else{
        console.log('Deleted Succesfully')
        
        res.redirect('/users/users_table')
      }
    })
  })

  module.exports = router;