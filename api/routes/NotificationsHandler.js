const Router = require('express').Router();
const NotificationService = require("./NotificationService");

Router.get("/", (req, res) => {
    const skip = req.query.skip || 0;
    const userId = req.user.id;
    NotificationService.getNotifications(userId, skip).then(notifications => {
        res.status(200).json({
            data: notifications,
            completed: notifications.length < 20
        });
    }).catch(err => {
        res.status(400).json({
            error: err.message
        })
    })
});
Router.post("/read",(req,res)=>{
    const userid=req.user.id;
    const {notification_id}=req.body;
    NotificationService.markasRead(notification_id).then(()=>{
        res.status(200).json({
            message:"maked as read"
        })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
})
Router.post("/remove",(req,res)=>{
    const userid=req.user.id;
    const {notification_id}=req.body;
    NotificationService.removeNotification(notification_id).then(()=>{
        res.status(200).json({
            message:"notification has been deleted!"
        })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
})


module.exports = Router;