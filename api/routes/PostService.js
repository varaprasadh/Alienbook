const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;

const Post = require("../models/Post");
const {createPost,formatPost} =require("./helper/createPost");
const getPost = require("./helper/getPost");

const retrieveUserInfo=require("./middlewares/attachUserInfo");

const contentSanitizer=require("./middlewares/contentSanitizer");
const path=require('path');
const multer=require("multer")();
const {uploadImages,uploadProfileImage,deleteImages} =require("./imageService/index");

const Reaction =require("../models/Reaction");
const Comment=require("../models/Comment");

//add the post
Router.post('/create', multer.array('images'), uploadImages, contentSanitizer, (req, res) => {
    let author=req.user.id;
    const { content} = req.body;
    const images=req.filesMeta;
    console.log(req.files,"oooo");
    createPost({author,content,images}).then(post=>{
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

Router.post("/test", multer.array("images"), uploadImages, (req, res) => {
  console.log(req.files);
  res.json(req.filesMeta);
});


//update the post 
Router.post("/update", contentSanitizer,(req, res) => {
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
Router.post("/delete", (req,res)=>{
    const {id} =req.body;
    Post.findOneAndDelete({id}).then(async post => {
        if(!post) throw new Error("post does'nt exist");
        const images=post.images || [];
        const public_ids=images.map(meta=>meta.public_id);
        await Reaction.deleteMany({post_id:id});
        await Comment.deleteMany({post_id:id});
        await deleteImages(public_ids);
        res.status(200).json({
           message:"post deleted!"
        })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
})

function test(p) {
    console.log(p);
    return p;
  }


//returns the all posts that user following
Router.get("/",retrieveUserInfo,(req, res) => {

    let skip= parseInt(req.query.skip) || 0;
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
        }, 
        {
            $unwind: {
                path:"$authorData",
                preserveNullAndEmptyArrays: true,
            },    
        }, 
        {
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
                $lookup: {
                    "from": "users",
                    "localField": "ref_author",
                    "foreignField": "id",
                    "as": "ref_author"
                }
            }, {
                $unwind: {
                    path: "$ref_author",
                    preserveNullAndEmptyArrays: true
                }
            },
             {
                $lookup: {
                    "from": "reactions",
                    "localField": "id",
                    "foreignField": "parent",
                    "as": "reactions"
                }
            },
             {
                $lookup: {
                    "from": "comments",
                    "localField": "id",
                    "foreignField": "post_id",
                    "as": "comments"
                }
            },
            {
                $addFields: {
                    reaction: {
                        $filter: {
                            input: "$reactions",
                            cond: {
                                $eq: ["$$this.user_id", current_user_id]
                            }
                        }
                    }
                }
            },
            {
              $unwind:{
                  path: "$reaction",
                  preserveNullAndEmptyArrays: true
              },
            },
            {
                $project: {
                    id: 1,
                    content: 1,
                    reactions:{
                        $size:"$reactions"
                    },
                    comments:{
                        $size:"$comments"
                    },
                    "reaction.type": 1,
                    refId: 1,
                    ref_author_username: 1,
                    type: 1,
                    author: 1,
                    createdAt: 1,
                    authorName: "$authorData.username",
                    ref_author_username: "$ref_author.username",
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
                    },
                    images: {
                        $map: {
                            input: "$images",
                            as: "meta",
                            in: "$$meta.url"
                        }
                    },
                }
            }
        ]).sort({createdAt:-1}).skip(skip).limit(20).then(records => {
            records.forEach(record=>{
                record.amIReacted = record.reaction != null;
                record.reaction = record.reaction || null;
            })
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
            $unwind: {
                path:"$authorData",
                preserveNullAndEmptyArrays: true,
            },   
        }, 
        {
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
                $lookup: {
                    "from": "users",
                    "localField": "ref_author",
                    "foreignField": "id",
                    "as": "ref_author"
                }
            }, {
                $unwind: {
                    path: "$ref_author",
                    preserveNullAndEmptyArrays: true
                }
            },
             {
                $lookup: {
                    "from": "reactions",
                    "localField": "id",
                    "foreignField": "parent",
                    "as": "reactions"
                }
            },
           {
                $lookup: {
                    "from": "comments",
                    "localField": "id",
                    "foreignField": "post_id",
                    "as": "comments"
                }
            }, 
            {
                $addFields: {
                    reaction: {
                        $filter: {
                            input: "$reactions",
                            cond: {
                                $eq: ["$$this.user_id", current_user_id]
                            }
                        }
                    }
                }
            },
             { $unwind: {
                  path: "$reaction",
                  preserveNullAndEmptyArrays: true
              }
            },
            {
                $project: {
                    id: 1,
                    content: 1,
                    reactions:{
                        $size:"$reactions"
                    },
                    comments:{
                        $size:"$comments"
                    },
                    "reaction.type": 1,
                    refId: 1,
                    ref_author_username: 1,
                    type: 1,
                    author: 1,
                    createdAt: 1,
                    authorName: "$authorData.username",
                    ref_author_username: "$ref_author.username",
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
                    },
                    images: {
                        $map: {
                            input: "$images",
                            as: "meta",
                            in: "$$meta.url"
                        }
                    },
                }
            },
            {
                "$match": {
                    "authorName": username
                }
            }
        ]).sort({createdAt:-1}).skip(skip).limit(20).then(records => {
             records.forEach(record => {
                 record.amIReacted = record.reaction != null;
                 record.reaction = record.reaction || null;
             })
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
        res.status(404).json({
            error:err.message
        })
    })
})


module.exports=Router;
