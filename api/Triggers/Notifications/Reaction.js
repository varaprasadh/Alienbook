const dotEnv = require('dotenv');
const mongoose = require('mongoose');

const connection=require("../../dbconnection");
const Reaction =require("../../models/Reaction");
const Comment =require("../../models/Comment");
const Relation =require("../../models/Relation");


const Notification=require("../../models/Notification");
const Post=require("../../models/Post");

const uuid=require("uuid").v4;

const fs=require("fs");
const path=require('path');
const NotificationTypes=require("./types");


//todo
//reaction comment send notifications to respective people


connection.then(conn=>{ 
    //start listening for change streams and generate notifications
    Reaction.watch().on('change',async change=>{
        // console.log(change);
        try{
            if (change.operationType === 'insert') {
                const fullDocument = change.fullDocument;
                const {
                    user_id,
                    post_id,
                }=fullDocument;
                //do the thing direct
                //target is post author we have post id , user_id,type
                const post = await Post.findOne({id: post_id});
                if (!post){
                    throw new Error("post doesnt exist");
                }
                const author=post.author;
                
                console.log(fullDocument);
                const parents=[...fullDocument.parents]

                let owner,type;

                //reacted to post
                if(parents.length==1){
                     owner=author;
                     type = NotificationTypes.REACTION;

                }else if(parents.length>1){
                    //possibly reacted to comment
                    const comment_id=parents[parents.length-1];
                    const comment=await Comment.findOne({id:comment_id});
                    console.log("wooohooo",comment);
                    owner=comment.user_id;
                    type=NotificationTypes.REACTED_TO_COMMENT;
                }

                if (owner === user_id) {
                    throw new Error("self notification is not required");
                }
                const notification = new Notification({
                    id: fullDocument._id,
                    type:type,
                    content: fullDocument.type,
                    owner: owner,
                    initiator: user_id,
                    parent_id: post_id,
                    parents: parents
                });
                //only send notification to top level 
                notification.save().then((record) => {
                    console.log("new notification", record);
                })
             
            }else if(change.operationType==="update"){
                //update the notification 
                    const docInfo = change.documentKey;
                    const notification = await Notification.findOne({
                        id: docInfo._id
                    });
                    if(!notification){
                        throw new Error("notification doesnt exisits");
                    }
                    notification.content = change.updateDescription.updatedFields.type;
                    notification.save().then((notification) => {
                        console.log("notification updateed", notification);
                    })
            }else if(change.operationType==="delete"){
                    const docInfo = change.documentKey;
                    await Notification.findOneAndDelete({id:docInfo._id});
                    console.log("notification deleted");
            }
        }catch(err){
            //do nothing
            console.log(err);

        }
        // fs.writeFileSync(`/home/varaprasadh/Desktop/logs/${Date.now()}.json`, JSON.stringify(change));
    });


    Comment.watch().on('change', async change => {
        try{
              if (change.operationType === 'insert') {
                const fullDocument = change.fullDocument;
                const {user_id,post_id,} = fullDocument;

                const post = await Post.findOne({
                    id: post_id
                });
                if (!post) {
                    throw new Error("post doesnt exist");
                }
                const author = post.author;
                if (author === user_id) {
                    throw new Error("self notification is not required");
                }
                const parents=[...fullDocument.parents];

                let owner,type;
                //top level comment
                if(parents.length==2){
                    owner=author;
                    type=NotificationTypes.COMMENT;
                }else{
                    //sub comment, send notification to only 
                    const comment_id=parents[parents.length-2];
                    const comment=await Comment.findOne({id:comment_id});
                    owner=comment.user_id;
                    type=NotificationTypes.REPLY_TO_COMMENT;
                }
                  if (owner === user_id) {
                      throw new Error("self notification is not required");
                  }
                  
                const notification = new Notification({
                    id: fullDocument._id,
                    type: type,
                    content: fullDocument.content,
                    owner: owner,
                    initiator: user_id,
                    parent_id: post_id,
                    parents: parents
                });
                notification.save().then((record) => {
                    console.log("new notification", record);
                })
              } else if (change.operationType === 'delete') {
                  const docInfo = change.documentKey;
                  await Notification.findOneAndDelete({
                      id: docInfo._id
                  });
                  console.log("notification deleted");
              }
        }catch(err){
            console.log(err);
            //do nothing
        }
        
    })
    Relation.watch().on('change', async change=>{
        try{

          //  fs.writeFileSync(`/home/varaprasadh/Desktop/logs/${Date.now()}.json`, JSON.stringify(change));
            const relation_doc_id=change.documentKey._id;
            const relation=await Relation.findOne({_id:relation_doc_id}); 
            
            if (change.operationType === 'insert') {

               const notification = new Notification({
                   id: relation_doc_id,
                   type: NotificationTypes.FOLLOW,
                   content: `started following you`,
                   owner: relation.target,
                   initiator: relation.source,
                   parent_id: relation_doc_id,
                   parents: [relation_doc_id]
               });
               notification.save().then((record) => {
                   console.log("new notification");
               })
            }else if(change.operationType==='update'){
                const updateInfo = change.updateDescription.updatedFields;

                if (updateInfo.status === 'following') {
                    //create notification
                    console.log(updateInfo.status, "again following");

                    const notification = new Notification({
                        id: relation_doc_id,
                        type: NotificationTypes.FOLLOW,
                        content: `started following you`,
                        owner: relation.target,
                        initiator: relation.source,
                        parent_id: relation_doc_id,
                        parents: [relation_doc_id]
                    });
                    notification.save().then((record) => {
                        console.log("new notification");
                    })
                } else {
                    console.log("unfollowed so notification relamoved");
                    Notification.deleteOne({id:relation_doc_id}).then(log=>{
                        console.log("notification delete status");
                    })
                }
            }else if(change.operationType==='delete'){
                console.log("rttottt",relation_doc_id);
                 Notification.deleteOne({id:relation_doc_id}).then(log=>{
                     console.log("notification related to relation also deleted");
                 });
            }

        }catch(err){
            console.log(err);
            //do nothing

        }
    })


}).catch(err=>{
    console.log("db error",err);
})
/*

const Notification = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    initiator: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    parent_id: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
*/