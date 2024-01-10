var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var surveyUsers = new Schema({
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    surveyLocation:{
        type:String,
        required:true
    },
    filepic:{
        type: String
    },
    password:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean
    },
    
    dailyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'daily_activity'
    },
     dailyDetailsId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'daily_activity_detail'
        },
     /* cordsId:{
        type: mongoose.Schema.Types.ObjectId,
                    ref: 'daily_activity_detail'
      }*/

},{ timestamps: true})
var Connect_user = module.exports = mongoose.model('connect_user', surveyUsers )

/*assign_users:{
    type: Schema.Types.ObjectId,
    ref: 'user_asign'
},*/