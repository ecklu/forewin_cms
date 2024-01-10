var express = require('express')
let router = express.Router();
var Users = require('../../models/connect_users')


router.get('/user',(req,res)=>{
    Users.find()
    //.select('name price _id productImage')//selecting the field to send
    .exec()
    .then(docs =>{
       const response ={
           count: docs.length,
           answers: docs.map(doc=>{
               return{
                   username: doc.name,
                   email: doc.email,
                   surveyLocation:doc.surveyLocation,
                    _id: doc._id,
                   request:{
                       type:'GET'
                       //url:'http://localhost:3000/products/' + doc._id
                   }
               }
           })
       }
       console.log(response)
        res.status(200).json(response)
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    })
})

router.get('/user/:id',(req,res)=>{
    var id = req.params.id
    Users.find({_id:id})
    //.select('name price _id productImage')//selecting the field to send
    .exec()
    .then(docs =>{
       const response ={
           count: docs.length,
           answers: docs.map(doc=>{
               return{
                   username: doc.name,
                   email: doc.email,
                   surveyLocation:doc.surveyLocation,
                    _id: doc._id,
                   request:{
                       type:'GET'
                       //url:'http://localhost:3000/products/' + doc._id
                   }
               }
           })
       }
       console.log(response)
        res.status(200).json(response)
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    })
})









router.post('/useractive/:id',(req,res)=>{

    
    let userActive = {}
    userActive.isActive = req.body.isActive
    let query = {_id:req.params.id}      
    Users.updateOne(query,userActive)
    .then(result =>{
        console.log(result)
        res.status(201).json({
            message:"Answers updated successfully",
            updateActiveUser: {
                answers:result.isActive,
                _id:result._id,
                request:{
                    type:'GET',
                   // url:'http://localhost:3000/products/' + result._id
                }
            }
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({error:err})
    })
})











module.exports = router;