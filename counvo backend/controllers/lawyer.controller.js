const LawyerModel = require('../models/lawyer.model');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const lawyerModel = require('../models/lawyer.model');
const { Certificate } = require('crypto');

// Configure Cloudinary
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ---------------------- Basic Lawyer CRUD ----------------------
const addLawyer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phone,
      barRegistrationNumber,
      practiceAreas,
      yearsOfExperience,
      workingHours,
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email already exists
    const existing = await LawyerModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Lawyer with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse optional JSON fields if needed
    const parsedPracticeAreas = typeof practiceAreas === 'string' 
      ? JSON.parse(practiceAreas) 
      : practiceAreas || [];

    const parsedWorkingHours = typeof workingHours === 'string'
      ? JSON.parse(workingHours)
      : workingHours || {};

    // Create and save new lawyer
    const newLawyer = new LawyerModel({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phone,
      // barRegistrationNumber,
      practiceAreas: parsedPracticeAreas,
      yearsOfExperience: yearsOfExperience || 0,
      workingHours: parsedWorkingHours,
    });

    const savedLawyer = await newLawyer.save();
    res.status(201).json({ message: 'Lawyer added successfully', lawyer: savedLawyer });
  } catch (error) {
    console.error('Error adding lawyer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const remove_lawyer=async(req,res)=>
{
  try {
    const id=req.params._id
    const lawyer= await LawyerModel.findByIdAndDelete({_id:id})
    res.status(200).send("lawyer delete successfully")
    
  } catch (error) {
    console.log(error);
    
  }
}

const loginLawyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find lawyer by email
    const lawyer = await LawyerModel.findOne({ email });
    
    // Check if lawyer exists
    if (!lawyer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    

    // Check if lawyer has a password
    if (!lawyer.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, lawyer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: lawyer._id, email: lawyer.email, role: 'lawyer' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Return token and lawyer info (without password)
    const { password: _, ...lawyerWithoutPassword } = lawyer.toObject();
    
    res.status(200).json({
      message: 'Login successful',
      token,
      // lawyer: lawyerWithoutPassword
      lawyer: lawyer
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchLawyers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = await LawyerModel.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { practiceAreas: { $regex: query, $options: 'i' } }
      ]
    }).select('-password');

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ---------------------- Registration & Email ----------------------
const registerLawyer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phone,
      barRegistrationNumber,
      practiceAreas,
      yearsOfExperience
    } = req.body;


    
    if (!firstName || !lastName || !email || !password  || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingLawyer = await LawyerModel.findOne({ email });
    if (existingLawyer) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const lawyerpic = [];

    // Upload documents to Cloudinary if files exist
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        lawyerpic.push(result.secure_url);
        
        // Delete local file after upload
        fs.unlink(file.path, err => {
          if (err) console.error(`Failed to delete file: ${file.path}`, err);
        });
      }
    }


    const lawyer = await LawyerModel.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phone,
      // barRegistrationNumber,
      practiceAreas: practiceAreas ? JSON.parse(practiceAreas) : [],
      yearsOfExperience: yearsOfExperience || 0,
      profilepic:lawyerpic,
      status: 'pending'
    });

    // sendConfirmationEmail(lawyer.email, lawyer.firstName);

    res.status(200).send({
      message: 'Registration successful. Your application is pending verification.',
      lawyerId: lawyer._id
    });
  } catch (error) {
    console.error('Lawyer registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const updatelawyerprofile = async (req, res) => {
 try {
  const lawyerid=req.params._id

    // Prepare for file upload
  const imagefiles = [];
  const imagefiles1 = [];
  const imagefiles2 = [];
  const imagefiles3 = [];
  const imagefiles4 = [];
  const imagefiles5 = [];

  if (req.files) {
    const imagefield = req.files.filter(file => file.fieldname.includes(`certificate`));
    const imagefield1 = req.files.filter(file => file.fieldname.includes(`identity_pic`));
    const imagefield2 = req.files.filter(file => file.fieldname.includes(`address_pic`));
    const imagefield3 = req.files.filter(file => file.fieldname.includes(`barCertificate`));
    const imagefield4 = req.files.filter(file => file.fieldname.includes(`aibeCertificate`));
    const imagefield5 = req.files.filter(file => file.fieldname.includes(`proofofpractice`));

    for (let file of imagefield) {
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

       for (let file of imagefield1) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        imagefiles1.push(result.secure_url);  

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

       for (let file of imagefield2) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        imagefiles2.push(result.secure_url);  

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

       for (let file of imagefield3) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        imagefiles3.push(result.secure_url);  

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

       for (let file of imagefield4) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        imagefiles4.push(result.secure_url);  

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

       for (let file of imagefield5) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        imagefiles5.push(result.secure_url);  

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
                        certificate:imagefiles,
                        identity_pic:imagefiles1,
                        address_pic:imagefiles2,
                        barCertificate:imagefiles3,
                        aibeCertificate:imagefiles4,
                        proofofpractice:imagefiles5,
                    };

  const resp = await lawyerModel.findByIdAndUpdate(
      lawyerid,                  // ID to find
      { $set: updatedFields },        // Update data
      { new: true }              // Return updated document
    );
  res.status(200).send({message:"profile update successfully",lawyer:resp})
  
 } catch (error) {
  console.log(error);
  
 }
};



function sendConfirmationEmail(toEmail, firstName) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "bharatproperties570@gmail.com",
      pass: "thpf pvbb pwfn idvf"
    }
  });

  const mailOptions = {
    from:"bharatproperties570@gmail.com",
    to: toEmail,
    subject: 'Registration Confirmation - Lawyer Portal',
    html: `<p>Hi ${firstName},</p><p>Thank you for registering as a lawyer. Your application is currently pending verification by our team.</p>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Email error:', err);
    } else {
      console.log('Confirmation email sent:', info.response);
    }
  });
}

// ---------------------- Profile & Availability ----------------------

const getallProfile = async (req, res) => {
  try {
    const lawyer = await LawyerModel.find()
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getallProfilebyid = async (req, res) => {
  try {
    const lawyerid=req.params._id
    const lawyer = await LawyerModel.findById({_id:lawyerid})
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getProfile = async (req, res) => {
  try {
    const lawyerId = req.user.id; // Assuming JWT middleware sets this
    const lawyer = await LawyerModel.findById(lawyerId).select('-password -documents');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveProfile = async (req, res) => {
  try {
    const lawyerId = req.params._id; // Correct route param
    const updates = req.body;       // e.g., { status: 'approved' }

    const lawyer = await LawyerModel.findByIdAndUpdate(
      lawyerId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    res.json({ message: 'Profile updated', lawyer });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateProfile = async (req, res) => {
  try {
 
    const lawyerId = req.user.id;
    const updates = req.body;
    
    // Prevent updating sensitive fields
    if (updates.password || updates.email || updates.barRegistrationNumber) {
      return res.status(403).json({ message: 'Cannot update this field' });
    }

    const lawyer = await LawyerModel.findByIdAndUpdate(
      lawyerId, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password -documents');

    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json({ message: 'Profile updated', lawyer });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { workingHours } = req.body;
    
    if (!workingHours) {
      return res.status(400).json({ message: 'Working hours required' });
    }

    const parsedWorkingHours = typeof workingHours === 'string'
      ? JSON.parse(workingHours)
      : workingHours;

    const lawyer = await LawyerModel.findByIdAndUpdate(
      lawyerId,
      { workingHours: parsedWorkingHours },
      { new: true, runValidators: true }
    );

    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json({ message: 'Working hours updated', workingHours: lawyer.workingHours });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleOnlineStatus = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { onlineStatus } = req.body;
    
    if (typeof onlineStatus !== 'boolean') {
      return res.status(400).json({ message: 'Invalid online status' });
    }

    const lawyer = await LawyerModel.findByIdAndUpdate(
      lawyerId,
      { onlineStatus },
      { new: true }
    ).select('-password');

    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json({ message: 'Online status updated', onlineStatus });
  } catch (error) {
    console.error('Toggle online status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addLawyer,
  loginLawyer,
  searchLawyers,
  registerLawyer,
  getProfile,
  updateProfile,
  updateAvailability,
  toggleOnlineStatus,
  getallProfile,
  approveProfile,
  getallProfilebyid,
  updatelawyerprofile,
  remove_lawyer
};