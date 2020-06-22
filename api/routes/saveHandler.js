// const Router = require('express').Router();
// const User = require("../models/User");
// const Post=require("../models/Post");

// Router.post("/save",(req,res)=>{
//     const userid=req.user.id;
//     const postid=req.body.postid;
//     User.findOne({id:userid}).then(user=>{
//         if(!user) throw new Error("user doesn't exist");
//         // console.log(user);
//         user.saved.addToSet(postid);
//         user.save().then(()=>{
//             res.status(200).json({
//                 success:true
//             });
//         }).catch(err=>{
//             throw err;
//         })
//     }).catch(err=>{
//         console.log(err);
//         res.status(400).json({
//             success:false
//         })
//     });
// })

// Router.post("/delete",(req,res)=>{
//    const userid=req.user.id;
//    const postid=req.body.postid;
//    User.findOne({id:userid}).then(user=>{
//        if(!user) throw new Error("user doesn't exist");
//        user.saved=user.saved.filter(id=>id!==postid);
//        user.save().then(()=>{
//            res.status(200).json({
//                success:true
//            });
//        }).catch(err=>{
//            throw err;
//        })
//    }).catch(err=>{
//        res.status(400).json({
//            success:false
//        })
//    });

// });
// Router.get("/saved",(req,res)=>{
//     const userid=req.user.id;
//     User.findOne({id:userid}).then(user=>{
//        if(!user)throw new Error("user doesn't exist");
//        Post.aggregate([
//          {
//              $match:{
//                  id:{
//                      $in: user.saved,
//                  }
//              }
//          },
//          {
//              $lookup: {
//                  "from": "users",
//                  "localField": "author",
//                  "foreignField": "id",
//                  "as": "authorData"

//              }
//          }, {
//              $unwind: "$authorData"
//          }, {
//              $project: {
//                  id: 1,
//                  content: 1, //{$substr:["$content",0,100]}
//                  likes: 1,
//                  comments: 1,
//                  author: 1,
//                  tags: 1,
//                  createdAt: 1,
//                  authorName: "$authorData.username"
//              }
//          }
//         ]).then(posts=>{
//            res.json({
//                success:true,
//                posts:posts
//            })
//        }).catch(err=>{
//            throw err;
//        })
//     }).catch(err=>{
//         res.status(400).json({
//             success:false,
//             error:err.message
//         })
//     })
// })


// module.exports=Router;