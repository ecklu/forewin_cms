

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cron = require('node-cron');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const Daily_activities = require('../models/daily_activity');
const Email = require('../models/email')

router.get('/view_report', function (req, res) {
  res.render('pages/reports/view_report');


});

router.get('/export', async (req, res) => {

  try {

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

   await csvWriter.writeRecords(transformedData);// Write data to CSV

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=exported_data.csv');

    // Pipe the CSV file to the response
    const stream = require('fs').createReadStream('exported_data.csv');
    stream.pipe(res);




  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});








// Schedule the cron job to run at 6:00 am every day
cron.schedule('* * * * *', async () => {
  try {
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
  }
});

module.exports = router;
