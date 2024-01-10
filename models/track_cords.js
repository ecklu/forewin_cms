var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var trackActivity = new Schema({
    cords:{
        type:String,
        required:true
    },

    userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'connect_user'
        }



},{ timestamps: true})

var Track_activity = module.exports = mongoose.model('track_activity', trackActivity )
