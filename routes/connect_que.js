var express = require('express');
var router = express.Router();
var multer = require('multer')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const AWS = require("aws-sdk");
const s3 = new AWS.S3()

var Shops = require('../models/connect_que')
var Activity_details = require('../models/daily_activity_details')
const Daily_activities = require('../models/daily_activity');
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






                   /*try {
                      const data = await Daily_activities.find({}).populate('userId').lean(); // Fetch data from MongoDB

                      // Define the columns you want to include in the CSV and their headers
                      const columns = [
                        { id: 'outlet', title: 'Outlet' },
                        { id: 'pinnedby', title: 'PinnedBy' },
                        { id: 'punchInTime', title: 'Punch In Time' },
                        { id: 'punchOutTime', title: 'Punch Out Time' },
                        // Add more columns as needed
                      ];

                      const csvWriter = createCsvWriter({
                        path: 'exported_data.csv', // Specify the file name
                        header: columns, // Use the keys of the first document as CSV header
                      });

                      // Transform the data to include only the desired columns
                      const transformedData = data.map(item => ({
                        outlet: item.outlet,
                        pinnedby: item.userId.name,
                        punchInTime: item.punchInTime,
                        punchOutTime: item.punchOutTime,
                        // Map additional columns as needed
                      }));

                      // Write data to CSV
                      await csvWriter.writeRecords(transformedData);

                      Email.find({})
                      .then(email=>{
                      email.forEach(function(data){
                      // Email sending logic outside the cron job
                      const myEmails = data.email //'ecklujohn@gmail.com';
                      console.log(myEmails);

                      const transporter = nodemailer.createTransport(
                        smtpTransport({
                          service: 'gmail',
                          host: 'smtp.gmail.com',
                          auth: {
                            user: 'forewinghana068@gmail.com',
                            pass: 'mibt ubnk ndag guhn',
                          },
                        })
                      );

                      const mailOptions = {
                        from: 'forewinghana068@gmail.com',
                        to: myEmails,
                        subject: 'Sample Subject',
                        text: 'Sample Text', // You can add a text body if needed
                        attachments: [
                          {
                            filename: 'exported_data.csv',
                            path: 'exported_data.csv',
                          },
                        ],
                      };

                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                      })
                      })
                    } catch (error) {
                      console.error('Error exporting data:', error);
                    }*/



                  
                   router.get('/email', async function (req, res) {
                     try {
                       // Get data from MongoDB
                       const data = await Daily_activities.find({}).populate('userId').lean();

                       // Define the columns you want to include in the CSV
                       const columns = [
                         { id: 'outlet', title: 'Outlet' },
                         { id: 'pinnedby', title: 'PinnedBy' },
                         { id: 'punchInTime', title: 'Punch In Time' },
                         { id: 'punchOutTime', title: 'Punch Out Time' },
                         // Add more columns as needed
                       ];

                       // Transform the data to include only the desired columns
                       const transformedData = data.map(item => ({
                         outlet: item.outlet,
                         pinnedby: item.userId.name,
                         punchInTime: item.punchInTime,
                         punchOutTime: item.punchOutTime,
                         // Map additional columns as needed
                       }));

                       // Write data to CSV
                       const csvWriter = createCsvWriter({
                         path: 'exported_data.csv',
                         header: columns,
                       });

                       await csvWriter.writeRecords(transformedData);

                       // Store CSV file in S3 bucket
                       await s3.putObject({
                         Bucket: 'cyclic-fair-erin-vulture-fez-eu-west-2',
                         Key: 'some_files/exported_data.csv',
                         Body: require('fs').createReadStream('exported_data.csv'),
                       }).promise();

                       // Email sending logic outside the cron job
                       Email.find({})
                         .then(email => {
                           email.forEach(function (data) {
                             const myEmails = data.email; //'ecklujohn@gmail.com';
                             console.log(myEmails);

                             const transporter = nodemailer.createTransport(
                               smtpTransport({
                                 service: 'gmail',
                                 host: 'smtp.gmail.com',
                                 auth: {
                                   user: 'forewinghana068@gmail.com',
                                   pass: 'mibt ubnk ndag guhn',
                                 },
                               })
                             );

                             const mailOptions = {
                               from: 'forewinghana068@gmail.com',
                               to: myEmails,
                               subject: 'Sample Subject',
                               text: 'Sample Text', // You can add a text body if needed
                               attachments: [
                                 {
                                   filename: 'exported_data.csv',
                                   path: 'exported_data.csv',
                                 },
                               ],
                             };

                             transporter.sendMail(mailOptions, function (error, info) {
                               if (error) {
                                 console.log(error);
                               } else {
                                 console.log('Email sent: ' + info.response);
                               }
                             });
                           });
                         });

                       console.log('Email sent successfully');
                     } catch (error) {
                       console.error('Error exporting data:', error);
                     }
                   });


module.exports= router;