const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;

const Post = require("../models/Post");

const Comment=require("../models/Comment");

const LIMIT=20;
const NotificationService=require("./NotificationService");

const contentSanitizer = require("./middlewares/contentSanitizer");

//create a comment for the post

const getComment=async (comment_id)=>{
  return await Comment.aggregate([
            {
               $match:{
                 id:comment_id
               }
            }, 
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "id",
                as: "author"
              }
            }, 
            {
              $unwind: "$author"
            }, 
            {
              $project: {
                content: 1,
                timestamp:1,
                comment_id: "$id",
                post_id: 1,
                user_id:1,
                authorName: "$author.username",
                parent_id: 1,
                depth:1
              }
            }
  ])
}

Router.post("/comment",contentSanitizer,async (req,res)=>{
  const user_id=req.user.id;
  const {post_id,parent_id,content}=req.body;
  const comment=new Comment({
    id:uuid(),
    user_id,
    post_id,
    parent_id,
    content
  });
  try{
     let savedComment=await comment.save();
     let commentResponse=getComment(savedComment.id);
     res.status(200).json({
       comment:commentResponse
     });

  }catch(err){
    res.status(400).json({
      error:err.message
    })
  }
})

/*

      NotificationService.createNotification({
        type: "COMMENT",
        initiator: userId,
        owner: comment.post_author_id,
        postId: postId,
        ref_id: comment.comment_id,
      });

*/

//delete a comment for the post
Router.post("/uncomment",async (req,res)=>{
  const {comment_id,post_id}=req.body;
  try{
    await Comment.deleteOne({id:comment_id});
  //  NotificationService.undoNotification({type:"COMMENT",ref_id:comment_id,postId:post_id});
    res.status(200).json({
      message::"comment has been deleted"
    })
  }catch(err){
    res.status(400).json({
      error:err.message
    })
  }



Router.get("/comments/:post_id",(req,res)=>{
 let {post_id}=req.params;
 let user_id=req.user.id;
 
})



//return all comments for the post;
Router.get("/comments/:postId",(req,res)=>{
  let {postId}=req.params;
  let skip=parseInt(req.query.skip) || 0
  Post.aggregate([{
      $match: {
        id: postId
      }
    },
    {
      $unwind: {
        path: "$comments",
        "preserveNullAndEmptyArrays": true,
      }
    },
    {

  ]).skip(skip).limit(LIMIT).then(comments=>{
    res.status(200).json({
      comments,
       completed: comments.length < 20
    });
  }).catch(err=>{
    res.status(400).json({
      error:err.message
    })
  })
});


module.exports=Router;