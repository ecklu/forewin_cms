var express = require('express');
var router = express.Router();

var UserAgent = require('../models/connect_users')

var date = new Date()
console.log(date.getDate())


router.get('/users',function(req,res){
    console.log('this date',date.getFullYear() )
    UserAgent.find({isActive:true}).lean()
    .then(activeData=>{
        console.log(activeData)
        res.render('pages/tables/active_users',{actData:activeData})
    })
   })

  /*router.get('/outlets',function(req,res){
    Users.find({}).lean()
    .then(users=>{
    res.render('pages/tables/connect_que_t',{
      users:users
    })
  })
  })*/


  

module.exports= router;