const express = require('express');
const mongoose = require('mongoose');
//const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');


const studentRoutes = require('./routes/student');
const studentFeesInfo = require('./routes/fees')



const app = express();
app.use(express.json());
app.use(cors({
   //origin: 'http://localhost:4200', // Allow only requests from your Angular frontend
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers like Content-Type, Authorization, etc.
 }));

 // Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//    service: 'Gmail', // or another email service like Outlook, Yahoo
//    auth: {
//      user: 'besandip615@gmail.com', // Your email
//      pass: 'Shivaji@28217', // Your email password or app password
//    },
//  });
 


app.use('/',studentRoutes);
app.use('/',studentFeesInfo);




// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("MongoDB connected"))
   .catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
