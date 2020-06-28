const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;

const Post = require("../models/Post");

const {createPost,formatPost} =require("./helper/createPost");
const getPost=require("./helper/getPost");


Router.post("/share",(req,res)=>{
    const userid=req.user.id;
    const {postid,username,content=" "}=req.body;
    createPost({
        author: userid,
        refId:postid,
        ref_author_username:username,
        content: content,
        type:"SHARE",
    }).then(post=>{
        getPost(post.id,userid).then(post=>{
            res.status(200).json({
                post:post
            });
        }).catch(err=>{
            throw new Error(err);
        })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
});




module.exports=Router;
