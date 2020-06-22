const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;

const Post = require("../models/Post");

const Comment=require("../models/Comment");


//create a comment for the post
Router.post("/comment",(req,res)=>{
  const userId=req.user.id;
  const {postId,text}=req.body;
  //update comment count on post
  //insert a comment
  let comment=new Comment({
      id:uuid(),
      user_id:userId,
      text:text
  });
  Post.update({id:postId},{$addToSet:{comments:comment}}).then(doc=>{
    console.log(doc);
    res.status(200).json({
      message:"created"
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
  Post.findOne({id:postId}).then(post=>{
    if(!post) throw new Error("post doesnt exist");
    res.status(200).json({
      comments:post.comments
    });
  }).catch(err=>{
    res.status(400).json({
      error:err.message
    })
  })

});





module.exports=Router;