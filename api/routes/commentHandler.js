const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;

const Post = require("../models/Post");

const Comment=require("../models/Comment");
const Reaction=require("../models/Reaction");


const LIMIT=20;
const NotificationService=require("./NotificationService");

const contentSanitizer = require("./middlewares/contentSanitizer");


//returns a breif comment 
const getComment=async (comment_id,user_id)=>{
  const response= await Comment.aggregate([
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
      $lookup:{
        from:"reactions",
        localField:"id",
        foreignField:"parent",
        as:"reactions"
      }
    },  
    {
      $addFields: {
        reaction: {
          $filter: {
            input: "$reactions",
            cond: {
              $eq: ["$$this.user_id", user_id]
            }
          }
        }
      }
    },
    {
      $unwind: {
        path: "$reaction",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "id",
        foreignField: "parent",
        as: "comments"
      }
    },
    {
      $project: {
        id:1,
        content: 1,
        timestamp: 1,
        comment_id: "$id",
        post_id: 1,
        user_id: 1,
        authorName: "$author.username",
        parent_id: 1,
        depth: 1,
        reaction:1,
        reactions:{
          $size:"$reactions"
        },
        comments:1
        //userprofilepic
      }
    }
  ]);
  return response[0];
}

Router.post("/comment",contentSanitizer,async (req,res)=>{
  const user_id=req.user.id;
  let {post_id,parent_id=null,content}=req.body;
  console.log("current",user_id,parent_id);
  const uid = uuid();

  const parentComment=await Comment.findOne({id:parent_id});
  console.log("debug",parentComment);
  let path=[];
  let depth=1;
  if (parentComment) {
    path = [...parentComment.parents];
    depth = parentComment.depth + 1;
  }else{
    path.push(post_id);
  }
  path.push(uid);
  try{
      if(depth>3){
        throw new Error("comment maximum depth exceeded");
      }
      const comment = new Comment({
          id: uid,
          user_id,
          post_id,
          content,
          depth,
          parent:parent_id||post_id,
          parents: path
      });
     let savedComment=await comment.save();
     console.log(savedComment);
     let commentResponse=await getComment(savedComment.id,user_id);
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
    await Comment.deleteMany({parents:comment_id});
    await Reaction.deleteMany({parents:comment_id});
  //  NotificationService.undoNotification({type:"COMMENT",ref_id:comment_id,postId:post_id});
    res.status(200).json({
      message:"comment has been deleted"
    })
  }catch(err){
    res.status(400).json({
      error:err.message
    })
  }
});


Router.get("/comments",(req,res)=>{
  const {post_id,parent_id=null}=req.query;
  const user_id=req.user.id;
  const skip = parseInt(req.query.skip) || 0;
  console.log(user_id);

  Comment.aggregate([
    {
       $match: {
         post_id:post_id,
         parent:parent_id || post_id
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
      $lookup:{
        from:"reactions",
        localField:"id",
        foreignField:"parent",
        as:"reactions"
      }
    },  
    {
      $addFields: {
        reaction: {
          $filter: {
            input: "$reactions",
            cond: {
              $eq: ["$$this.user_id", user_id]
            }
          }
        }
      }
    },
    {
      $unwind: {
        path: "$reaction",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "id",
        foreignField: "parent",
        as: "comments"
      }
    },
    {
      $project: {
        id:1,
        content: 1,
        timestamp: 1,
        comment_id: "$id",
        post_id: 1,
        user_id: 1,
        authorName: "$author.username",
        parent_id: 1,
        depth: 1,
        reaction:1,
        reactions:{
          $size:"$reactions"
        },
        comments:1
        //userprofilepic
      }
    }
  ]).skip(skip).limit(LIMIT).then((comments)=>{
      res.status(200).json({
        comments,
        completed:comments.length<20
      })
    }).catch(err=>{
      res.status(400).json({
        error:err.message
      })
    })
});



module.exports=Router;