
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


const getChatSummary = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Step 1: Aggregate chat summary
    const agg = [
      // only lawyer-user chats
      {
        $match: {
          $or: [
            { fromModel: "Lawyer", toModel: "User" },
            { fromModel: "User", toModel: "Lawyer" }
          ]
        }
      },
      // normalize fields
      {
        $project: {
          lawyer: {
            $cond: [{ $eq: ["$fromModel", "Lawyer"] }, "$from", "$to"]
          },
          user: {
            $cond: [{ $eq: ["$fromModel", "User"] }, "$from", "$to"]
          },
          timestamp: 1
        }
      },
      // group per lawyer-user pair
      {
        $group: {
          _id: { lawyer: "$lawyer", user: "$user" },
          firstMessage: { $min: "$timestamp" },
          lastMessage: { $max: "$timestamp" },
          totalMessages: { $sum: 1 }
        }
      },
      // compute duration
      {
        $project: {
          lawyer: "$_id.lawyer",
          user: "$_id.user",
          totalMessages: 1,
          durationMinutes: {
            $divide: [
              { $subtract: ["$lastMessage", "$firstMessage"] },
              1000 * 60
            ]
          }
        }
      },
      // group by lawyer
      {
        $group: {
          _id: "$lawyer",
          users: {
            $push: {
              userId: "$user",
              totalMessages: "$totalMessages",
              durationMinutes: { $round: ["$durationMinutes", 2] }
            }
          },
          totalUsers: { $sum: 1 }
        }
      },
      // lookup lawyer info
      {
        $lookup: {
          from: "lawyers",
          localField: "_id",
          foreignField: "_id",
          as: "lawyer"
        }
      },
      { $unwind: "$lawyer" },
      // lookup user info for each user
      {
        $lookup: {
          from: "users",
          localField: "users.userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      // merge user details
      {
        $addFields: {
          users: {
            $map: {
              input: "$users",
              as: "u",
              in: {
                userId: "$$u.userId",
                totalMessages: "$$u.totalMessages",
                durationMinutes: "$$u.durationMinutes",
                userName: {
                  $let: {
                    vars: {
                      matched: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$userDetails",
                              as: "ud",
                              cond: { $eq: ["$$ud._id", "$$u.userId"] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: "$$matched.fullName"
                  }
                }
              }
            }
          }
        }
      },
      // final projection
      {
        $project: {
          lawyerId: "$lawyer._id",
          lawyerName: { $concat: ["$lawyer.firstName", " ", "$lawyer.lastName"] },
          totalUsers: 1,
          users: 1
        }
      },
      // sort by lawyerName
      { $sort: { lawyerName: 1 } }
    ];

    // Step 2: Get total lawyers count for pagination
    const totalLawyers = (await Message.aggregate([
      ...agg.slice(0, -2), // remove final projection & sort
      { $group: { _id: "$lawyer" } } // count unique lawyers
    ])).length;

    const totalPages = Math.ceil(totalLawyers / limit);

    // Step 3: Apply skip & limit
    const result = await Message.aggregate([
      ...agg,
      { $skip: skip },
      { $limit: limit }
    ]);

    res.status(200).json({ chatSummary: result, totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch chat report" });
  }
};

const getUserChatSummary = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Step 1: Aggregate user chat summary
    const agg = [
      // Only user-lawyer chats
      {
        $match: {
          $or: [
            { fromModel: "User", toModel: "Lawyer" },
            { fromModel: "Lawyer", toModel: "User" }
          ]
        }
      },
      // Normalize fields
      {
        $project: {
          user: { $cond: [{ $eq: ["$fromModel", "User"] }, "$from", "$to"] },
          lawyer: { $cond: [{ $eq: ["$fromModel", "Lawyer"] }, "$from", "$to"] },
          timestamp: 1
        }
      },
      // Sort messages chronologically per user-lawyer
      {
        $sort: { user: 1, lawyer: 1, timestamp: 1 }
      },
      // Group messages per user-lawyer pair
      {
        $group: {
          _id: { user: "$user", lawyer: "$lawyer" },
          messages: { $push: "$timestamp" },
          totalMessages: { $sum: 1 },
          firstMessage: { $min: "$timestamp" },
          lastMessage: { $max: "$timestamp" }
        }
      },
      // Calculate session count and duration
      {
        $project: {
          user: "$_id.user",
          lawyer: "$_id.lawyer",
          totalMessages: 1,
          durationMinutes: {
            $divide: [{ $subtract: ["$lastMessage", "$firstMessage"] }, 1000 * 60]
          },
          sessionCount: {
            $size: {
              $filter: {
                input: {
                  $map: {
                    input: { $range: [0, { $size: "$messages" }] },
                    as: "i",
                    in: {
                      $cond: [
                        { $eq: ["$$i", 0] }, // first message is always a session
                        1,
                        {
                          $cond: [
                            {
                              $gt: [
                                {
                                  $subtract: [
                                    { $arrayElemAt: ["$messages", "$$i"] },
                                    { $arrayElemAt: ["$messages", { $subtract: ["$$i", 1] }] }
                                  ]
                                },
                                30 * 60 * 1000 // 30 minutes threshold for a new session
                              ]
                            },
                            1,
                            0
                          ]
                        }
                      ]
                    }
                  }
                },
                as: "val",
                cond: { $eq: ["$$val", 1] }
              }
            }
          }
        }
      },
      // Group by user
      {
        $group: {
          _id: "$user",
          lawyers: {
            $push: {
              lawyerId: "$lawyer",
              totalMessages: "$totalMessages",
              durationMinutes: { $round: ["$durationMinutes", 2] },
              sessionCount: "$sessionCount"
            }
          },
          totalLawyers: { $sum: 1 }
        }
      },
      // Lookup user info
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      // Lookup lawyer info
      {
        $lookup: {
          from: "lawyers",
          localField: "lawyers.lawyerId",
          foreignField: "_id",
          as: "lawyerDetails"
        }
      },
      // Merge lawyer details
      {
        $addFields: {
          lawyers: {
            $map: {
              input: "$lawyers",
              as: "l",
              in: {
                lawyerId: "$$l.lawyerId",
                totalMessages: "$$l.totalMessages",
                durationMinutes: "$$l.durationMinutes",
                sessionCount: "$$l.sessionCount",
                lawyerName: {
                  $let: {
                    vars: {
                      matched: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$lawyerDetails",
                              as: "ld",
                              cond: { $eq: ["$$ld._id", "$$l.lawyerId"] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: { $concat: ["$$matched.firstName", " ", "$$matched.lastName"] }
                  }
                }
              }
            }
          }
        }
      },
      // Final projection
      {
        $project: {
          userId: "$userInfo._id",
          userName: "$userInfo.fullName",
          totalLawyers: 1,
          lawyers: 1
        }
      },
      { $sort: { userName: 1 } }
    ];

    // Step 2: Get total users count for pagination
    const totalUsers = (await Message.aggregate([
      ...agg.slice(0, -2), // remove final projection & sort
      { $group: { _id: "$user" } } // unique users
    ])).length;

    const totalPages = Math.ceil(totalUsers / limit);

    // Step 3: Apply skip & limit
    const result = await Message.aggregate([
      ...agg,
      { $skip: skip },
      { $limit: limit }
    ]);

    res.status(200).json({ userChatSummary: result, totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch user chat summary" });
  }
};






module.exports={getchathistory,getallchathistory,uploaddocument,getallchathistoryforrecentchat,getChatSummary,
  getUserChatSummary
}