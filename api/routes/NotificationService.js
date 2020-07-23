const User=require("../models/User");
const Notification=require("../models/Notification");
const uuid=require('uuid').v4;

const NOTIFY_TYPES={
    LIKE:"LIKE",
    COMMENT:"COMMENT",
    SHARE:"SHARE",
    FOLLOW:"FOLLOW"
}



const createNotification = ({
        type,
        initiator,
        postId = "",
        ref_id,
        owner,
        content=""
    }) => {
        let notification=new Notification({
            type,
            initiator,
            postId,
            ref_id,
            owner,
            content,
            id:uuid()
        });
        if (owner === initiator) {
            console.log("cant");
            return;
        }
       return notification.save().then(()=>{
           //push notificagtion thing
           console.log("added notification");
       })
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

  //refid : commentid || likeid || 
  
  const undoNotification=({type,postId,ref_id,initiator,owner})=>{
     if(type==="LIKE" || type==="COMMENT"){
         let query={};
         if(type==="LIKE"){
             query={postId,type}
         }else{
             query={ref_id,type}
         }
         return new Promise((resolve,reject)=>{
            Notification.findOneAndDelete(query).then(()=>{
                console.log("undone",type);
                resolve("done");
            }).catch(err=>reject(err));
     })
    }
     if(type==="SHARE"){
         return new Promise((resolve, reject) => {
           Notification.findOneAndDelete({
               initiator,
               owner,
               type,
               postId
           }).then(()=>resolve("done")).catch(err=>reject(err))
         })
     }
     if(type==="FOLLOW"){
        return new Promise((resolve,reject)=>{
           Notification.findOneAndDelete({
               initiator,
               owner,
               type
           }).then(()=>{
               console.log("undone follow");
               resolve("done");
           }).catch(err=>reject(err));
         })
     }
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
                   from: "$initiator.username",
                   type: 1,
                   timestamp: 1,
                   ref_id: 1,
                   postId: 1,
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
    createNotification,
    getNotifications,
    markasRead,
    removeNotification,
    undoNotification
};




