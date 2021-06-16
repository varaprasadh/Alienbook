const query_messages = (coversation_id,user_id,skip=0,limit=20) => (
  [{
          $match: {
              $and: [{
                      conversation_id: coversation_id
                  },
                  {
                      deleted_by: {
                          $ne: user_id
                      }
                  }
              ]
          }
      },
      {
          $lookup: {
              from: "users",
              localField: "sender_id",
              foreignField: "id",
              as: "sender"
          }
      },
      {
          $unwind: "$sender"
      },
      {
          $sort: {
              created_at: -1
          }
      },
      {
          $skip: skip
      },
      {
          $limit: 20
      },
      {
          $project: {
              _id:0,
              id: 1,
              conversation_id: 1,
              read_by: 1,
              deleted_by: 1,
              from: {
                  id: "$sender.id",
                  username: "$sender.username",
                  fullname: "$sender.fullName",
                  avatar: {
                      $ifNull: ["$sender.pictures.profile.url", null]
                  }
              },
              message: {
                  content: "$content",
                  timestamp: "$created_at"
              }
          }
      }
  ]
);

module.exports={
    query_messages
}
