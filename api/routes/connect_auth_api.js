var express = require('express')
let router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

var Users = require('../../models/connect_users')

//system api handler
router.post('/connect_users_login',(req,res)=>{
    Users.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message:'Authentication Failed'
            })
        }
        bcrypt.compare(req.body.password, user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:'Authentication Failed'
                })
            }
            if(result){
                const token = jwt.sign({
                    email:user[0].email,
                    userId:user[0]._id
                },'secret',{
                    expiresIn:"1h"
                })
                return res.status(200).json({
                    message: 'login Successful',
                    token:token
                   
                })
            }
            return res.status(401).json({
                message:'Authentication Failded'
            })
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})





module.exports = router;