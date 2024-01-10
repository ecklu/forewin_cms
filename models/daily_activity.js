var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var dailyActivity = new Schema({
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

var Daily_activity = module.exports = mongoose.model('daily_activity', dailyActivity )
