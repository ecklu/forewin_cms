var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var emailActivity = new Schema({
    user_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }




},{ timestamps: true})

var emailActivity = module.exports = mongoose.model('user_emails', emailActivity )
