var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); //used to hash or encrypt passwords

//Defining the signup schema

var userSchema = new Schema({
    email: {type:String, required:true},
    password:{type:String, required:true}
},{ timestamps: true})

userSchema.methods.encryptPassword = function(password){
    //encrypting the password by hashing and generating salt
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

//validating the password
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User',userSchema);