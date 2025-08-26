
const Message = require('../models/chathistory'); // Adjust path if needed

const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

const getchathistory=async(req,res)=>
{
   try {
     const { user1Id, user2Id } = req.params;

    const messages = await Message.find({
      $or: [
        { from: user1Id, to: user2Id },
        { from: user2Id, to: user1Id },
      ],
    }).sort({ timestamp: 1 }); // oldest first

    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch messages' });
    console.log(error);
    
  }
}

const getallchathistory=async(req,res)=>
{
   try {

    const messages = await Message.find().populate('from').populate('to')
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch messages' });
    console.log(error);
    
  }
}

const getallchathistoryforrecentchat=async(req,res)=>
{
   try {

     const messages = await Message.find()
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch messages' });
    console.log(error);
    
  }
}




cloudinary.config({
  cloud_name: 'dplgmreai',
  api_key: '967352841637756',
  api_secret: 'sgr_ptgAzZfDOwIen9EwWwmY0IY'
});



const uploaddocument= async (req, res) => {
  try {
    const file = req.file;
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ url: result.secure_url, type: result.resource_type });
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




module.exports={getchathistory,getallchathistory,uploaddocument,getallchathistoryforrecentchat}