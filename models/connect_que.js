var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var connectQue = new Schema({
    region:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    outlet:{
        type:String,
         required:true
    },

    lat:{
        type:Number,
        required:true
    },
    long:{
        type:Number,
        required:true
    }



})

var Connect_que = module.exports = mongoose.model('shop', connectQue)