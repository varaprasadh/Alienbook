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
const Relation =require("../models/Relation");

//add the post
Router.post('/create', multer.array('images'), uploadImages, contentSanitizer, (req, res) => {
    let author=req.user.id;
    const { content} = req.body;
    const images=req.filesMeta;
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



//update the post 
Router.post("/update", multer.array('images'), uploadImages, contentSanitizer, async (req, res) => {
     let userId=req.user.id;
      const {content, postid,prev_urls=[],} = req.body; //parse the content extract tags
      //remove useless images
      //update meta on 
      //upload new images and save meta data
      const uploadedFilesMeta = req.filesMeta || [];

      try{
        const post=await Post.findOne({id:postid});
        post.content=content;
        post.lastModifiedAt=Date.now();

        //images to be deleted
        const junk_public_ids=[];
        post.images=post.images.filter(meta=>{
            if(prev_urls.indexOf(meta.url)==-1){
                //this should be removed;
                junk_public_ids.push(meta.public_id);
                return false;
            }
            return true;
        });
        //delete the junk from cloudinary
        await deleteImages(junk_public_ids);

        //update the new photos meta data
        post.images.push(...uploadedFilesMeta);

        //save the post
        await post.save();
        
        //upload new images and save meta
            getPost(postid, userId).then(post => {
                res.status(200).json({
                    post: post
                })
            }).catch(err => {
                throw new Error(err)
            })
      }catch(err){
          res.status(400).json({
              error:err.message
          })
      }
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
Router.get("/",async (req, res) => {

    let skip= parseInt(req.query.skip) || 0;
    let current_user_id=req.user.id
    let following_users=await Relation.aggregate([
        {
            $match:{
                source:current_user_id,
                status:"following"
            }
        }
    ])
    following_users =following_users.map(relation=>relation.target);
    Post.aggregate([
        {  $match:
            {
                $or:[
                    {author:{"$in":following_users}},
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
                    profile_pic_url: "$authorData.pictures.profile.url",
                    originalPost: {
                        $cond: {
                            if: {
                                $ne: ["$sharedContent", undefined]
                            },
                            then: {
                                profile_pic_url: "$prim_author.pictures.profile.url",
                                content: "$sharedContent.content",
                                createdAt: "$sharedContent.createdAt",
                                id: "$sharedContent.id",
                                author: "$sharedContent.author",
                                authorName: "$prim_author.username",
                                images: {
                                    $map: {
                                        input: "$sharedContent.images",
                                        as: "meta",
                                        in: "$$meta.url"
                                    }
                                },
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
                $sort:{
                    createdAt: -1
                }
            }
        ]).skip(skip).limit(20).then(records => {
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
                    profile_pic_url: "$authorData.pictures.profile.url",
                    ref_author_username: "$ref_author.username",
                    originalPost: {
                        $cond: {
                            if: {
                                $ne: ["$sharedContent", undefined]
                            },
                            then: {
                                profile_pic_url: "$prim_author.pictures.profile.url",
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
