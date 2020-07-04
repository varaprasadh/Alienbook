const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;

const Post = require("../models/Post");

const Comment=require("../models/Comment");

const LIMIT=20;
const NotificationService=require("./NotificationService");

//create a comment for the post
Router.post("/comment",(req,res)=>{
  const userId=req.user.id;
  const {postId,text}=req.body;
  //update comment count on post
  //insert a comment
  const cid = uuid()
  let comment=new Comment({
      id: cid,
      user_id:userId,
      text:text
  });
  Post.update({id:postId},{$addToSet:{comments:comment}}).then(doc=>{
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
        $match: {
          "comments.id": cid
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.user_id",
          foreignField: "id",
          as: "authorinfo"
        }
      },
      {
        $unwind: "$authorinfo"
      },
      {
        $project: {
          "post_author_id":"$author",
          content: "$comments.text",
          timestamp: "$comments.timestamp",
          comment_id: "$comments.id",
          post_id: "$id",
          author_id: "$comments.user_id",
          authorName: "$authorinfo.username"
        }
      }
    ]).then(([comment])=>{
      NotificationService.createNotification({
        type:"COMMENT",
        initiator:userId,
        owner: comment.post_author_id,
        postId:postId,
        ref_id: comment.comment_id,
      });
      res.status(200).json({
        comment
      })
    })
  }).catch(err=>{
    res.status(400).json({
      error:err.message
    })
  })
});
//delete a comment for the post
Router.post("/uncomment",(req,res)=>{

  const {postId,commentId}=req.body;
  Post.updateOne({id:postId},{$pull:{comments:{id:commentId}}}).then((doc)=>{
    if (doc.nModified===0){
      throw new Error("comment was already deleted");
    }
    NotificationService.undoNotification({type:"COMMENT",ref_id:commentId,postId:postId});
    res.status(200).json({
      message:"comment deleted"
    })
  }).catch(err=>{
    res.status(400).json({
      error:err.message
    })
  });
});

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
      $lookup: {
        from: "users",
        localField: "comments.user_id",
        foreignField: "id",
        as: "authorinfo"
      }
    },
    {
      $unwind: "$authorinfo"
    },
    {
      $project: {
        content: "$comments.text",
        timestamp: "$comments.timestamp",
        comment_id: "$comments.id",
        post_id: "$id",
        author_id: "$comments.user_id",
        authorName: "$authorinfo.username"
      }
    }
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