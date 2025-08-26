const feedbackmodal =require('../models/feedback')
const lawyerfeedbackmodal =require('../models/feedback')


const addfeedback = async (req, res) => {
  try {
    const {satisfaction,fee_fairness,payment_issue,prefer_counvo,fee_type,suggestions} = req.body;

    const newfeedback = new feedbackmodal({
      satisfaction,fee_fairness,payment_issue,prefer_counvo,fee_type,suggestions
    });

    const resp = await newfeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: resp });
  } catch (error) {
    console.error('Error adding lawyer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addlawyerfeedback = async (req, res) => {
  try {
    const {client_pay,fee_negoatiated,delays_issue,other_plateform} = req.body;

    const newfeedback = new feedbackmodal({
      client_pay,fee_negoatiated,delays_issue,other_plateform
    });

    const resp = await newfeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: resp });
  } catch (error) {
    console.error('Error adding lawyer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports={addfeedback,addlawyerfeedback}