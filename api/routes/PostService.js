const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;

const Post = require("../models/Post");
const {createPost,formatPost} =require("./helper/createPost");
const getPost = require("./helper/getPost");

//add the post
Router.post('/create',(req, res) => {
    let author=req.user.id;
    const { content} = req.body;
    createPost({author,content}).then(post=>{
        getPost(post.id, author).then(post => {
            res.status(200).json({
                post:post
            })
        })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
});

//update the post 
Router.post("/update",(req,res)=>{
     let userId=req.user.id;
      const {content, postid} = req.body; //parse the content extract tags
      Post.findOneAndUpdate({
          id: postid
      }, {
          content,
          lastModifiedAt:Date.now()
      }).then(post=>{
          getPost(postid,userId).then(post=>{
              res.status(200).json({
                  post:post
              })
          }).catch(err=>{
              throw new Error(err)
          })
      }).catch(err=>{
         console.log(err);
          res.status(400).json({
              error: "something went wrong!"
          })
      })
}) 
// delete a post 
Router.post("/delete",(req,res)=>{
    const {id} =req.body;
    Post.findOneAndDelete({id}).then(post => {
        if(!post) throw new Error("post does'nt exist");
        res.status(200).json({
           message:"post deleted!"
        })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
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


//returns the all posts that user following
Router.get("/",retrieveUserInfo,(req, res) => {

    let skip=req.query.skip && parseInt(req.query.skip) || 0;
    let current_user_id=req.user.id
    Post.aggregate([
        {  $match:
            {
                $or:[
                    {author:{"$in": req.user.info.following}},
                    {author:{"$eq": current_user_id }}
                ]
            }
        },
    {
        $lookup: {
            "from": "users",
            "localField": "author",
            "foreignField": "id",
            "as": "authorData"
        }
    }, {
        $unwind: "$authorData"
    }, {
        $lookup: {
            "from": "posts",
            "localField": "refId",
            "foreignField": "id",
            "as": "sharedContent"
        }
    }, {
        $unwind: {
            preserveNullAndEmptyArrays: true,
            path: "$sharedContent"
        }
    }, {
        $lookup: {
            "from": "users",
            "localField": "sharedContent.author",
            "foreignField": "id",
            "as": "prim_author"
        }
    }, {
        $unwind: {
            path: "$prim_author",
            preserveNullAndEmptyArrays: true
        }
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
            refId: 1,
            ref_author_username: 1,
            type: 1,
            author: 1,
            createdAt: 1,
            liked:{
                $in:[current_user_id,"$likes.user_id"]
            },
            authorName: "$authorData.username",
            ref_author_username:1,
            originalPost: {
                $cond: {
                    if: {
                        $ne: ["$sharedContent", undefined]
                    },
                    then: {
                        content: "$sharedContent.content",
                        createdAt: "$sharedContent.createdAt",
                        id: "$sharedContent.id",
                        author: "$sharedContent.author",
                        authorName: "$prim_author.username"
                    },
                    else: null
                }
            }
        }
    }
    ]).skip(skip).limit(20).then(records => {
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
       }, {
           $unwind: "$authorData"
       }, {
           $lookup: {
               "from": "posts",
               "localField": "refId",
               "foreignField": "id",
               "as": "sharedContent"
           }
       }, {
           $unwind: {
               preserveNullAndEmptyArrays: true,
               path: "$sharedContent"
           }
       }, {
           $lookup: {
               "from": "users",
               "localField": "sharedContent.author",
               "foreignField": "id",
               "as": "prim_author"
           }
       }, {
           $unwind: {
               path: "$prim_author",
               preserveNullAndEmptyArrays: true
           }
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
               refId: 1,
               ref_author_username: 1,
               type: 1,
               author: 1,
               createdAt: 1,
               authorName: "$authorData.username",
                liked: {
                    $in: [current_user_id, "$likes.user_id"]
                },
                ref_author_username:1,
                originalPost: {
                   $cond: {
                       if: {
                           $ne: ["$sharedContent", undefined]
                       },
                       then: {
                           content: "$sharedContent.content",
                           createdAt: "$sharedContent.createdAt",
                           id: "$sharedContent.id",
                           author: "$sharedContent.author",
                           authorName: "$prim_author.username"
                       },
                       else: null
                   }
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
            error: err.message
        });
    })
});

Router.get("/post/:id",(req,res)=>{
    let current_user_id=req.user.id;
    let postid=req.params.id;
    getPost(postid,current_user_id).then(post=>{
        res.status(200).json({
            post:post
        });
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
})


module.exports=Router;
