const cors=require('cors');
const express=require('express');
const nodemailer=require('nodemailer');
const StatusCodes =require('./Statuscodes.js');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/contact', async (req, res) => {
  const { name, email, feedback } = req.body;

  if (!name || !email || !feedback) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'All fields are required.' });
  }

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,  
      to: process.env.TO_EMAIL,                               
      replyTo: email,                                         
      subject: `New Message from ${name}`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${feedback.replace(/\n/g, '<br>')}</p>
      `,
    });
    res.status(StatusCodes.SUCCESS).json({ status: StatusCodes.SUCCESS, msg: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending mail:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status:StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Failed to send message.' });
  }
});

app.listen(process.env.PORT,()=>{
  console.log('Server running ! ');
});
