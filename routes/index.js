var express = require('express')
var routes = express.Router()
var sock = require('../bin/www')
var Outletsque = require('../models/connect_que')
var UserAgent = require('../models/connect_users')
var DailyActivities = require('../models/daily_activity')




routes.get('/',(req,res)=>{

 
 /*sock.sock.on('connection',(socket)=>{
    console.log('connected')
    socket.emit('message', 'sample call');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  })*/

  

Outletsque.find({}).sort({shop_name: -1 }).lean()
.then(data=>{
  var totlatOulet = {sumOutlet:data.length}
  console.log(totlatOulet)
UserAgent.find({}).lean()
.then(agent=>{
  var totalAgent = {sumAgent:agent.length}
 UserAgent.find({isActive:true}).countDocuments().lean()
 .then(activeUser=>{
  console.log(activeUser)
 DailyActivities.find({}).lean()
 .populate('userId')
 .then(activity=>{
  res.render('index',{data:data,tout:totlatOulet,tagent:totalAgent,active:activeUser,activity:activity})
  })
})
})
})
})

   







module.exports = routes;