const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;
const Like =require("../models/Like");

const Post = require("../models/Post");
const NotificationService=require("./NotificationService");


Router.post("/like",(req,res)=>{
    let {postId}=req.body;
    let userId = req.user.id;
    const likeId = uuid();
    const like=new Like({
        user_id:userId,
        id:likeId
    });
    Post.findOne({id:postId,"likes.user_id":{$nin:[userId]}}).then((post)=>{
       if(!post){
           throw new Error("already liked the post");
           //update the reaction type
       }

       post.likes.addToSet(like);
       post.save().then(()=>{
            NotificationService.createNotification({
                owner: post.author,
                type: "LIKE",
                initiator: userId,
                postId: postId,
                ref_id:likeId
            })
            res.status(200).json({
                message: "liked the post"
            });
            console.log(post);
          
        }).catch(err=>{
           console.log(err);
           throw new Error("cant like the post");
       })
    
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        });
    })
});


Router.post("/dislike",(req,res)=>{
    let {postId}=req.body;
     let userId = req.user.id;
    Post.update({id:postId},{$pull:{likes:{user_id:userId}}}).then(doc=>{
        if (doc.nModified===0){
            throw new Error("already disliked");
        }
        NotificationService.undoNotification({postId:postId,type:"LIKE",initiator:userId});
        res.status(200).json({
            message:"disliked!"
        })
    }).catch(err=>{
        res.status(400).json({
            message:err.message
        })
    })
});

Router.get("/likes/:postId",(req,res)=>{
  const postId=req.params.postId;
  const skip=req.query.skip || 0;
  Post.aggregate([{
          $match: {
              id: postId
          }
      }, {
          $unwind: {
              path: "$likes",
              "preserveNullAndEmptyArrays": true
          }
      },
      {
          $lookup: {
              from: "users",
              as: "userData",
              localField: "likes.user_id",
              foreignField: "id"
          }
      },
      {
          $unwind: {
              path: "$userData",
              "preserveNullAndEmptyArrays": true
          }
      },
      {
          $project:{
              username: "$userData.username",
              timestamp:"$likes.timestamp",
              type:"$likes.type"
          }
      }
  ]).skip(skip).limit(20).then(likes=>{
      res.status(200).json({
          likes,
          completed:likes.length<20
      })
  }).catch(err=>{
      res.status(400).json({
          error:err.message
      })
  })
})

module.exports=Router;