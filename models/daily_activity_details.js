var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var dailyActivityDetails = new Schema({
    outlet:{
        type:String,
        required:true
    },
    punchInTime:{
        type:String
    },
     punchOutTime:{
            type:String
        },
    userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'connect_user'
        }



},{ timestamps: true})

var Daily_activity_details = module.exports = mongoose.model('daily_activity_detail', dailyActivityDetails )
