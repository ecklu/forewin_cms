var express = require('express');
var router = express.Router();
var multer = require('multer')
var Shops = require('../models/connect_que')
var Activity_details = require('../models/daily_activity_details')
var Users = require('../models/connect_users')
var Email = require('../models/email')

//setting up my file storage
var storage = multer.diskStorage({
  destination : function(req,file,cb){
      cb(null,'./public/upload/')
  },
  filename: function(req,file,cb){
      cb(null, Date.now() + file.originalname)
  }
})
var upload = multer({storage:storage})




router.get('/connect',function(req,res){

   
  
      //console.log("survey details")
      res.render('pages/forms/connect_que')
  
  })

  router.get('/outlets',function(req,res){
    Connect_que.find({}).lean()
    .then(outlets=>{
    res.render('pages/tables/connect_que_t',{
      outlets:outlets
    })
  })
  })


    router.get('/daily_users',function(req,res){
        Users.find({}).lean()
        .then(users=>{
        res.render('pages/tables/daily_activity_users_t',{
          users:users
        })
      })
      })

    router.get('/daily_activity/:id',function(req,res){
      Activity_details.find({userId:req.params.id}).lean()
      .then(activity=>{
      res.render('pages/tables/daily_activity_t',{
        activity:activity
      })
    })
    })


  router.get('/user_outlets/:id',function(req,res){
    var id = req.params.id;
    Connect_que.find({users_id:id}).lean()
    .then(outlets=>{
    res.render('pages/tables/user_outlets_t',{
      outlets:outlets
    })
  })
  })

  router.get('/outlet_feed/:id',function(req,res){
    var id = req.params.id;
    Connect_que.findById({_id:id}).lean()
    .then(outlets=>{
    res.render('pages/tables/outlet_details_t',{
      outlets:outlets
    })
  })
  })
  
  
  
  router.post('/connect_que', function(req,res){
  
    var shop = new Shops();
    shop.outlet = req.body.outlet;
    shop.city = req.body.city;
    shop.region = req.body.region;
    shop.lat = req.body.lat;
    shop.long = req.body.long;

    
      
      shop.save(function(err){
        if(err){
          console.log(err)
          return;
        }else{
          console.log('Registeres Succesfully')
          res.redirect('/connect/connect')
        }
      })
  })
  
  router.get('/connectoutlet_edit/:id',function(req,res){
    var id = req.params.id;
    console.log(id)
    Connect_que.findById({_id:id}).lean()
    .then(data=>{
      console.log(data._id)
    res.render('pages/forms/connect_outlet_edit',{data:data})
  })
  })
  
  router.post('/connectoutlets_edit/:id',upload.single('execfile'),function(req,res){
    console.log('editing working')
    let connectque = {}
   
    connectque.shop_name = req.body.name;
    connectque.contact = req.body.phoneNumber;
    connectque.email = req.body.email;
    connectque.area_location = req.body.location;
    connectque.shop_type = req.body.shop_type;
    connectque.file = "Picture";
      
    let query = {_id:req.params.id}
    Connect_que.updateOne(query,connectque, function(err){
        if(err){
          console.log(err)
          return;
        }else{
          console.log('Edited Succesfully')
          res.redirect('/connect/outlets')
        }
      })
      })
   
  
      router.get('/outlet/delete/:id',function(req,res){
        //console.log('deleting working')
        let query = req.params.id;
      
        Connect_que.findByIdAndRemove(query, function(err){
          if(err){
            console.log(err)
            return;
          }
            res.redirect('/connect/outlets');
        })
      })


   //daily activites
   router.get('/daily_activities',function(req,res){

       Activity_details.find().lean()
       .populate("userId")
       .then(activites=>{
       res.render('pages/tables/daily_activity_details',{
         activites:activites
       })
     })
     })


  //email
  router.get('/email_activity',function(req,res){

        Email.find({}).lean()
        .then(email=>{


         res.render('pages/tables/email_t',{
            email:email
         })

         })

       })

   router.get('/add_email',function(req,res){


            res.render('pages/forms/emails')

          })


      router.post('/create_email', function(req,res){

        var email = new Email();
        email.user_name = req.body.username;
        email.email = req.body.email;



          email.save(function(err){
            if(err){
              console.log(err)
              return;
            }else{
              console.log('Registeres Succesfully')
              res.redirect('/connect/email_activity')
            }
          })
      })

module.exports= router;