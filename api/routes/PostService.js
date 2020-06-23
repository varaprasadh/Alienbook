const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;

const Post = require("../models/Post");
const {createPost} =require("./helper/createPost");

//add the post
Router.post('/create',(req, res) => {
    let author=req.user.id;
    const { content} = req.body;
    createPost({author,content}).then(post=>{
        res.status(200).json({
            post:post
        })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
});

//update the post 
Router.post("/update",(req,res)=>{
    // let userId=req.user.id;
      const {content, id} = req.body; //parse the content extract tags
      Post.findOneAndUpdate({
          id
      }, {
          content,
          lastModifiedAt:Date.now()
      }).then(post=>{
          res.status(200).json({
              post:{...post._doc,likes:post.likes.length,comments:post.comments.length,shared:post.shared.length}
          })
      }).catch(err=>{
          res.status(400).json({
              success:false,
              error: "something went wrong!"
          })
      })
})
// delete a post 
Router.post("/delete",(req,res)=>{
    const {id} =req.body;
    Post.findOneAndDelete({id}).then(post => {
        res.status(200).json({
           message:"post deleted!"
        })
    }).catch(err=>{
        res.status(400).json({
            error:"unable to delete,try again"
        })
    })
})

const retrieveUserInfo=(req,res,next)=>{
    User.findOne({id:req.user.id}).then(user=>{
        if(!user) throw new Error("user doenst exist");
        req.user.info=user;
        next();
    }).catch(err=>{
        res.status(404).json({
            message:"user doesnt exist"
        });
    })
}


//returns the all posts
Router.get("/",retrieveUserInfo,(req, res) => {

    console.log("debug");

    let skip=req.query.skip && parseInt(req.query.skip) || 0;
    let current_user_id=req.user.id
    Post.aggregate([
        {  $match:
            {
                author:{
                    "$in": req.user.info.following //following
                }
            }
        },
        {
             $lookup: {
                 "from": "users",
                 "localField": "author",
                 "foreignField": "id",
                 "as": "authorData"
             }
        },
        {
            $unwind: "$authorData"
        },
        {
           $project: {
               id: 1,
               content: 1,
               likes: {
                   $size:"$likes"
               },
               comments:{
                   $size:"$comments"
               },
               shared:{
                   $size:"$shared"
               },
               author: 1,
               createdAt: 1,
               authorName: "$authorData.username",
               liked: {
                   $in: [current_user_id, "$likes.user_id"]
               }
           }
        }]).skip(skip).limit(20).then(records => {
        res.status(200).json({
            posts: records,
            completed: records.length < 20
        });
    }).catch(err => {
        res.status(400).json({
            error: err.message
        });
    })
});
//returns posts for the specific user (redundent code,figure it out later);
Router.get("/:username",(req, res) => {
    let skip=req.query.skip && parseInt(req.query.skip) || 0;
    let username=req.params.username;
    let current_user_id = req.user.id;
    Post.aggregate([
        {
             $lookup: {
                 "from": "users",
                 "localField": "author",
                 "foreignField": "id",
                 "as": "authorData"
             }
        },
        {
            $unwind: "$authorData"
        },
        {
           $project: {
               id: 1,
               content: 1,
               likes: {
                   $size: "$likes"
               },
               comments: {
                   $size: "$comments"
               },
               shared: {
                    $size: "$shared"
               },
               author: 1,
               createdAt: 1,
               authorName: "$authorData.username",
               liked: {
                  $in:[current_user_id,"$likes.user_id"]
                },
               isSharedByUser:{
                   $in:[current_user_id,"$shared"]
               }
           }
        },
        {
            "$match": {
                "authorName":username
            }
        }
        ]).skip(skip).limit(20).then(records => {
        res.status(200).json({
            posts: records,
            completed: records.length < 20
        });
    }).catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    })
});

Router.get("/post/:id",(req,res)=>{
    let current_user_id=req.user.id;
   Post.aggregate([
       {
           $match:{
               id:req.params.id
           }
       },

       {
           $lookup: {
               "from": "users",
               "localField": "author",
               "foreignField": "id",
               "as": "authorData"

           }
       },
       {
           $unwind: "$authorData"
       },
       {
           $project: {
               id: 1,
               content: 1,
               likes: {
                   $size:"$likes"
               },
               comments:{
                   $size:"$comments"
               },
                shared: {
                    $size: "$shared"
                },
               author: 1,
               createdAt: 1,
               authorName: "$authorData.username",
               liked: {
                   $in: [current_user_id, "$likes.user_id"]
               }
           }
       }
   ]).limit(1).then(([post]) => {
       if(!post) throw new Error("post does'nt exist");
       res.status(200).json({
           post: post
       });
   }).catch(err => {
       res.status(404).json({
           error: "post does'nt exit"
       });
   })

})

module.exports=Router;
