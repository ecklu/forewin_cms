var express = require('express')
let router = express.Router();
var TestQue = require('../../models/connect_que')
var DailyActivity= require('../../models/daily_activity')
var DailyActivityDetails = require('../../models/daily_activity_details')

router.get('/connect',(req,res)=>{
    TestQue.find()
    //.select('name price _id productImage')//selecting the field to send
    .exec()
    .then(docs =>{
       const response ={
           count: docs.length,
           answers: docs.map(doc=>{
               return{
                   shopName: doc.outlet,
                   lat: doc.lat,
                   long:doc.long,
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

router.get('/connect_test/:id',(req,res)=>{
    var id = req.params.id
    TestQue.find({users_id:id})
    //.select('name price _id productImage')//selecting the field to send
    .exec()
    .then(docs =>{
       const response ={
           count: docs.length,
           answers: docs.map(doc=>{
               return{
                   shopName: doc.shop_name,
                   dates:doc.dates,
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

router.get('/connect_summary/:id',(req,res)=>{
    var id = req.params.id
    TestQue.find({users_id:id}).sort({shop_name: -1 }).limit(3).lean()
    //.select('name price _id productImage')//selecting the field to send
    .exec()
    .then(docs =>{
       const response ={
           count: docs.length,
           answers: docs.map(doc=>{
               return{
                   shopName: doc.shop_name,
                   shopLocation: doc.area_location,
                   dates:doc.dates,
                    _id: doc._id,
                   request:{
                       type:'GET'
                       //url:'http://localhost:3000/products/' + doc._id
                   }
               }
              /* console.log("this shop",doc.shop_name)
               console.log("this location",doc.area_location)*/
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




router.get('/connect_total_shop/:id',(req,res)=>{
    var id = req.params.id
    TestQue.find({users_id:id}).sort({shop_name: -1 }).lean()
    //.select('name price _id productImage')//selecting the field to send
    .exec()
    .then(docs =>{
       const response ={
           count: docs.length,
           answers: docs.map(doc=>{
               return{
                   shopName: doc.shop_name,
                   shopLocation: doc.area_location,
                   dates:doc.dates,
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

//getting current data
/*var currentdate = new Date();
var datetime = "Last Sync: " + currentdate.getDay() + "/" + currentdate.getMonth() 
+ "/" + currentdate.getFullYear() + " @ " 
+ currentdate.getHours() + ":" 
+ currentdate.getMinutes() + ":" + currentdate.getSeconds();

router.get('/currentshop/:id',(req,res)=>{
    var id = req.params.id
    TestQue.find({users_id:id})
    //.select('name price _id productImage')//selecting the field to send
    .exec()
    .then(docs =>{
       const response ={
           count: docs.length,
           answers: docs.map(doc=>{
           // if(doc.dates.getHours == currentdate.getHours){}
               return{

                   shopName: doc.shop_name,
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
*/

router.get('/activities',(req,res)=>{
    DailyActivity.find()
    //.select('name price _id productImage')//selecting the field to send
    .exec()
    .then(docs =>{
       const response ={
           count: docs.length,
           answers: docs.map(doc=>{
               return{
                   shopName: doc.outlet,
                   punchInTime: doc.punchInTime,
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

//Daily actitvies ids pushed
router.get('/activities_details',(req,res)=>{
    DailyActivityDetails.find()
    //.select('name price _id productImage')//selecting the field to send
    .exec()
    .then(docs =>{
       const response ={
           count: docs.length,
           answers: docs.map(doc=>{
               return{
                   shopName: doc.outlet,
                   punchInTime: doc.punchInTime,
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






router.post('/daily_activity',(req,res)=>{

DailyActivity.find({outlet:req.body.outlet, userId: req.body.user_id})
.exec()
.then(data=>{
if(data.length >= 1){
    console.log("outlet already exist")
}else{

    const daily_activity = new DailyActivity({
        //_id: new mongoose.Types.ObjectId(),
        outlet: req.body.outlet,
        punchInTime:req.body.punchInTime,
        punchOutTime:req.body.punchOutTime,
        userId: req.body.user_id
       
    })
     daily_activity.save()

     const daily_activity_details = new DailyActivityDetails({
             //_id: new mongoose.Types.ObjectId(),
             outlet: req.body.outlet,
             punchInTime:req.body.punchInTime,
             punchOutTime:req.body.punchOutTime,
             userId: req.body.user_id

         })
          daily_activity_details.save()


    .then(result =>{
        console.log(result)
        res.status(201).json({
            message:"Answers created successfully",
            createdProduct: {
                answers:result.outlet,
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
}
    })
})





router.post('/punchout/:id',(req,res)=>{


    let punchout = {}
    punchout.punchOutTime = req.body.punchOutTime
    let query = {_id:req.params.id}
    DailyActivity.updateOne(query,punchout)
    .then(result =>{
        console.log(result)
        res.status(201).json({
            message:"Answers updated successfully",
            updateActiveUser: {
                answers:result.punchOutTime,
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

//punchout for daiy activities details
router.post('/punchout_details/:id',(req,res)=>{


    let punchouts = {}
    punchouts.punchOutTime = req.body.punchOutTime
    let query = {_id:req.params.id}
    DailyActivityDetails.updateOne(query,punchouts)
    .then(result =>{
        console.log(result)
        res.status(201).json({
            message:"Answers updated successfully",
            updateActiveUser: {
                answers:result.punchOutTime,
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