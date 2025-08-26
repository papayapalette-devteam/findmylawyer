const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String  },
  email: { type: String },
  username: { type: String  },
  password: { type: String },
  profilepic:{type:Array},
  gender: { type: String },
  dob: { type: String },
  contact_no: { type: String },
  residential_address: { type: String },
  state: { type: String },
  city: { type: String },
  pin_code: { type: String },
  corrosponding_address: { type: String },
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
