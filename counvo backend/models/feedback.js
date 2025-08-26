const mongoose = require('mongoose');

const feedbackschema = new mongoose.Schema({
  satisfaction: { type: String  },
  fee_fairness: { type: String },
  payment_issue: { type: String  },
  prefer_counvo: { type: String },
  fee_type:{type:String},
  suggestions: { type: String },
}, { timestamps: true });

const lawyerfeedbackschema = new mongoose.Schema({
  client_pay: { type: String  },
  fee_negoatiated: { type: String },
  delays_issue: { type: String  },
  other_plateform: { type: String },
}, { timestamps: true });
 
const lawyerfeedbackmodal = mongoose.model('lawyer-feedback', lawyerfeedbackschema);

module.exports = lawyerfeedbackmodal;
