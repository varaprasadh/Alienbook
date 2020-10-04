const User=require("../models/User");
const Notification=require("../models/Notification");
const uuid=require('uuid').v4;

const NOTIFY_TYPES = {
    REACTION: "REACTION",
    COMMENT: "COMMENT",
    FOLLOW: "FOLLOW",
    SHARE: "SHARE",
    REACTED_TO_COMMENT: "REACTED_TO_COMMENT",
    REPLY_TO_COMMENT: "REPLY_TO_COMMENT"
}

  const removeNotification=(notificationId)=>{
     return new Promise((resolve,reject)=>{
        Notification.findOneAndDelete({id:notificationId}).then(notification=>{
            resolve("done");
        }).catch(err=>reject(err))
     })
  }

  const markasRead=(notificationId)=>{
    return new Promise((resolve,reject)=>{
        Notification.findOneAndUpdate({id: notificationId},{$set:{read:true}})
        .then((doc)=>{
            console.log(doc);
            resolve(doc)
        }).catch(err=>reject(err))
    })
  }



  const getNotifications=(userid,skip=0)=>{
      return new Promise((resolve,reject)=>{
       Notification.aggregate([{
               $match: {
                   owner: userid
               }
           },
           {
               $lookup: {
                   from: "users",
                   localField: "initiator",
                   foreignField: "id",
                   as: "initiator"
               },
           },
           {
               $unwind: "$initiator"
           },
           {
               $project: {
                   from: {
                      username: "$initiator.username",
                      avatar: "$initiator.pictures.profile.url"
                   },
                   type: 1,
                   timestamp: 1,
                   parent_id: 1,
                   read: 1,
                   content:1,
                   notification_id: "$id"
               }
           }
       ]).sort({timestamp:-1}).skip(skip).limit(20).then(notifications=>{

           resolve(notifications);
       }).catch(err=>reject(err))
      })
  }

module.exports = {
    getNotifications,
    markasRead,
    removeNotification
};




