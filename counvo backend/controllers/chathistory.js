
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

    const agg = [
      // Step 1: Consider only Lawyer–User chats
      {
        $match: {
          $or: [
            { fromModel: "Lawyer", toModel: "User" },
            { fromModel: "User", toModel: "Lawyer" }
          ]
        }
      },
      // Step 2: Normalize lawyer and user fields
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
      // Step 3: Sort by lawyer, user, and timestamp
      {
        $sort: { lawyer: 1, user: 1, timestamp: 1 }
      },
      // Step 4: Calculate previous message timestamp using $setWindowFields
      {
        $setWindowFields: {
          partitionBy: { lawyer: "$lawyer", user: "$user" },
          sortBy: { timestamp: 1 },
          output: {
            prevTime: {
              $shift: {
                output: "$timestamp",
                by: -1
              }
            }
          }
        }
      },
      // Step 5: Determine time gap (in minutes) between messages
      {
        $addFields: {
          timeGapMinutes: {
            $divide: [{ $subtract: ["$timestamp", "$prevTime"] }, 1000 * 60]
          },
          newSession: {
            $cond: [
              { $gt: [{ $divide: [{ $subtract: ["$timestamp", "$prevTime"] }, 1000 * 60] }, 10] },
              1,
              0
            ]
          }
        }
      },
      // Step 6: Generate a session number
      {
        $setWindowFields: {
          partitionBy: { lawyer: "$lawyer", user: "$user" },
          sortBy: { timestamp: 1 },
          output: {
            sessionNumber: { $sum: "$newSession" }
          }
        }
      },
      // Step 7: Group messages by session
      {
        $group: {
          _id: { lawyer: "$lawyer", user: "$user", session: "$sessionNumber" },
          start: { $min: "$timestamp" },
          end: { $max: "$timestamp" },
          totalMessages: { $sum: 1 }
        }
      },
      // Step 8: Calculate each session’s duration in minutes
      {
        $project: {
          lawyer: "$_id.lawyer",
          user: "$_id.user",
          session: "$_id.session",
          totalMessages: 1,
          durationMinutes: {
            $divide: [{ $subtract: ["$end", "$start"] }, 1000 * 60]
          }
        }
      },
      // Step 9: Group by lawyer → collect users and compute averages
      {
        $group: {
          _id: "$lawyer",
          totalSessions: { $sum: 1 },
          averageChatTime: { $avg: "$durationMinutes" },
          users: {
            $push: {
              userId: "$user",
              totalMessages: "$totalMessages",
              durationMinutes: { $round: ["$durationMinutes", 2] }
            }
          }
        }
      },
      // Step 10: Lookup lawyer info
      {
        $lookup: {
          from: "lawyers",
          localField: "_id",
          foreignField: "_id",
          as: "lawyer"
        }
      },
      { $unwind: "$lawyer" },
      // Step 11: Lookup user info
      {
        $lookup: {
          from: "users",
          localField: "users.userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      // Step 12: Merge user details
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
      // Step 13: Final projection
      {
        $project: {
          lawyerId: "$lawyer._id",
          lawyerName: { $concat: ["$lawyer.firstName", " ", "$lawyer.lastName"] },
          totalSessions: 1,
          averageChatTime: { $round: ["$averageChatTime", 2] },
          users: 1
        }
      },
      // Step 14: Sort alphabetically
      { $sort: { lawyerName: 1 } }
    ];

    // Step 15: Pagination
    const totalLawyers = (
      await Message.aggregate([
        ...agg.slice(0, 9),
        { $group: { _id: "$lawyer" } }
      ])
    ).length;

    const totalPages = Math.ceil(totalLawyers / limit);

    const result = await Message.aggregate([
      ...agg,
      { $skip: skip },
      { $limit: limit }
    ]);

    res.status(200).json({
      chatSummary: result,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch chat summary" });
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




const getTypeOfCaseRepeatUsage = async (req, res) => {
  try {
    const result = await Message.aggregate([
      // ✅ Include only messages where receiver is a lawyer
      { $match: { toModel: "Lawyer" } },

      // ✅ Join lawyer info
      {
        $lookup: {
          from: "lawyers", // check actual collection name
          localField: "to",
          foreignField: "_id",
          as: "lawyerData"
        }
      },
      { $unwind: "$lawyerData" },

      // ✅ Unwind lawyer specializations array (important!)
      { $unwind: { path: "$lawyerData.specializations", preserveNullAndEmptyArrays: true } },

      // ✅ Sort messages
      { $sort: { from: 1, to: 1, timestamp: 1 } },

      // ✅ Group by user-lawyer pair and specialization
      {
        $group: {
          _id: { user: "$from", lawyer: "$to", caseType: "$lawyerData.specializations" },
          messages: { $push: "$timestamp" }
        }
      },

      // ✅ Calculate sessions (10-min gap = new session)
      {
        $project: {
          caseType: "$_id.caseType",
          sessionCount: {
            $reduce: {
              input: "$messages",
              initialValue: { last: null, count: 0 },
              in: {
                $let: {
                  vars: {
                    diff: {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$$value.last", null] },
                            {
                              $gte: [
                                { $subtract: ["$$this", "$$value.last"] },
                                10 * 60 * 1000 // 10 min
                              ]
                            }
                          ]
                        },
                        true,
                        false
                      ]
                    }
                  },
                  in: {
                    last: "$$this",
                    count: {
                      $cond: [
                        "$$diff",
                        { $add: ["$$value.count", 1] },
                        "$$value.count"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      },

      // ✅ Add 1 to include the first session
      {
        $project: {
          caseType: 1,
          sessionCount: { $add: ["$sessionCount.count", 1] }
        }
      },

      // ✅ Average sessions per case type (specialization)
      {
        $group: {
          _id: "$caseType",
          avgSessions: { $avg: "$sessionCount" },
          totalPairs: { $sum: 1 }
        }
      },

      { $sort: { avgSessions: -1 } }
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};










module.exports={getchathistory,getallchathistory,uploaddocument,getallchathistoryforrecentchat,getChatSummary,
  getUserChatSummary,getTypeOfCaseRepeatUsage
}