const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
 type_of_case:{type:String},
 total_number:{type:Number},
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('case_type', adminLogSchema);




// const switch_time_schema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true // 👈 ensures one document per user
//   },
//   switchTimes: [  // 👈 array of numbers
//     {
//       type: Number
//     }
//   ],
//   timestamp: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('SwitchTime', switch_time_schema);


// module.exports = mongoose.model('switch_time', switch_time_schema);

