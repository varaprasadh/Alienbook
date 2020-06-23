const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;

const Post = require("../models/Post");

Router.post("/save", (req, res) => {
    const userid = req.user.id;
    const postid = req.body.postid;
    Post.findOne({
        id: postid
    }).then(post => {
        post.saved.addToSet(userid);
        post.save().then(post => {
            res.status(200).json({
                message: "this post has been shared to your timeline!"
            });
        })
    }).catch(err => {
        res.status(400).json({
            error: err.message
        })
    })
});
Router.post("/unsave", (req, res) => {
    const userid = req.user.id;
    const postid = req.body.postid;
    Post.findOne({
        id: postid
    }).then(post => {
        post.saved.pull(userid);
        post.save().then(() => {
            res.status(200).json({
                message: "post has been removed from timeline"
            })
        });
    }).catch(err => {
        res.status(400).json({
            error: err.message
        })
    })
})



module.exports = Router;
