const User=require("../models/User");
const Notification=require("../models/Notification");
const uuid=require('uuid').v4;

const NOTIFY_TYPES={
    LIKE:"LIKE",
    COMMENT:"COMMENT",
    SHARE:"SHARE"
}

class NotificationService(){

  createNotification({type,initiatorId,postId,authorId}){
        let notification=new Notification({
            type,
            initiator: initiatorId,
            postId,
            id:uuid();
        });
        if (authorId === initiatorId){
            return;
        }
        User.findOne({
            id: authorId
        }).then(user=>{
            if(!user) throw new Error("user not found");
            user.notifications.push(notification);
            user.save().then(user=>{
                //send push notification to user to update notification section
            });

        }).catch(err=>{
            //ignore
        })
  }
  removeNotification(userId,notificationId){
     return new Promise((resolve,reject)=>{
         User.findOne({id: userId},{
             $pull: {
                 notifications: {
                     id: notificationId
                 }
             }
         }).then(doc => {
             if (doc.nModified === 0) {
                 throw new Error("already deleted")
             }
             resolve("done")
         }).catch(err => {
             reject(err);
         })
     })
  }
  //todo  
//   markAsRead(userid,notificationId){
//       return new Promise((resolve,reject)=>{
//           User.find
//       })
//   }


}

module.exports=NotificationService;
