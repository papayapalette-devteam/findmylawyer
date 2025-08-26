

const UserModel=require('../models/user.model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).send({ message: "All fields are mandatory" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ fullName, username, email, password: hashedPassword });
    const resp = await newUser.save();
    return res.status(201).send({ message: 'Registered successfully', user: resp });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error Occurred" });
  }
};



const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: 'Username and Password are mandatory' });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    return res.status(200).send({ message: 'Login successful', user });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Error occurred' });
  }
};



// reset PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).send({ message: 'Email and new password are mandatory' });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).send({ error: 'Internal server error' });
  }
};




const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Define reset link (later you can generate a token)
   const resetLink = `http://localhost:5000/SetPassword`;


    // Setup nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services like SendGrid, Outlook, etc.
      auth: {
        user: 'bharatproperties570@gmail.com',
        pass: 'thpf pvbb pwfn idvf', // ⚠️ Use Gmail app password, NOT your actual Gmail password
      },
    });

    const mailOptions = {
      from: 'bharatproperties570@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <p>Hi ${user.name || ''},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Reset password email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).send({ error: 'Failed to send reset email' });
  }
};

const setNewPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).send({ message: 'Email and new password are required' });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Set new password error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};
// Add this to your user.controller.js
const getUserDetails = async (req, res) => {
  try {
    const userId = req.params._id;

    const user = await UserModel.findById(userId).select('-password'); // Exclude password
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).send({ error: 'Internal server error' });
  }
};

const getuser = async (req, res) => {
  try {
  
    const user = await UserModel.find(); 
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).send({ error: 'Internal server error' });
  }
};

const updateuserprofile = async (req, res) => {
 try {
  const userid=req.params._id

  const imagefiles = [];
  if (req.files) {

    for (let file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        imagefiles.push(result.secure_url);  

        // Delete file after upload
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Failed to delete file: ${file.path}`, err);
          } else {
            console.log(`Successfully deleted file: ${file.path}`);
          }
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

  }

   const updatedFields = {
                        ...req.body,
                        profilepic:imagefiles,
                    };

  const resp = await UserModel.findByIdAndUpdate(
      userid,                  // ID to find
      { $set: updatedFields },        // Update data
      { new: true }              // Return updated document
    );
  res.status(200).send({message:"profile update successfully",lawyer:resp})
  
 } catch (error) {
  console.log(error);
  
 }
};

// Add to exports
module.exports = { registerUser, loginUser, resetPassword, sendResetEmail, setNewPassword, getUserDetails,getuser,updateuserprofile };

