var express = require('express')
var routes = express.Router()

var Connect_que = require('../models/connect_que')

routes.get('/mapview',function(req,res){
    Connect_que.find({}).lean()
    .then(que_data=>{
        console.log(que_data)
        res.render('pages/maps/view_map',{data:que_data})
    })
    
})


module.exports = routes;