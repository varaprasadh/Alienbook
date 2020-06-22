const Router = require('express').Router();
const Post = require("../models/Post");
const Tag=require("../models/Tag");
const User=require("../models/User");
const uuid=require('uuid').v1;


//returns tags that are available
// Router.get("(/:regex|/)",(req,res)=>{
//     let regex=req.params.regex || "";
//   Post.aggregate([{
//           $unwind: "$tags"
//       }, {
//           $group: {
//               _id: "$tags"
//           }
//       }, {
//           $project: {
//               "tag": "$_id",
//               _id: 0
//           }
//       }, {
//           $match: {
//             "tag":{
//                 $regex:regex
//             }
//           }
//       }]).then(tags => {
//       res.json({
//           success:true,
//           tags
//       });
//   }).catch(err=>{
//       console.log(err);
//      res.json({
//          success:false,
//          error:"something went wrong"
//      })
//   })
// })

//returns tags that user follows
// Router.get("/user/tags",(req,res)=>{
//     const userid=req.user.id;
//     console.log("debug >",userid);
//     User.findOne({id:userid}).then(user=>{
//         if(!user) throw new Error("user not found");
//         console.log("debug",user.interested_tags);
//         res.json({
//             success:true,
//             tags: user.interested_tags
//         });
//     }).catch(err=>{
//         res.json({
//             success:false,
//             error:err.message
//         })
//     })
// });
//unfollow the tag
// Router.post("/unfollow",(req,res)=>{
//     const userId=req.user.id;
//     const {tag}=req.body;
//     User.findOne({id:userId}).then(user=>{
//         if(!user) throw new Error("user does'nt exist!");
//         user.interested_tags = user.interested_tags.filter(_tag => _tag !== tagLabel);
//         user.save().then(() => {
//             res.json({
//                 success:true,
//             });
//         }).catch(e=>{
//             throw new Error("tag can't be unfollowd");
//         }).catch(err=>{
//             res.json({
//                 success:false,
//                 error:err.message
//             })
//         })
//     })
// });
//follow the tag 
// Router.post("/follow",(req,res)=>{
//     const {tags}=req.body;
//     const userid=req.user.id;
//     User.findOne({id:userid}).then(user=>{
//         if (!user) throw new Error("user does'nt exist!");
//         user.interested_tags=[];
//         user.interested_tags.addToSet(...tags);
//         user.save().then(() => {
//             res.json({
//                 success:true,
//             });
//         }).catch(err=>{
//             throw new Error("something went wrong");
//         })
//     }).catch(err=>{
//         res.json({
//             success:false,
//             error:err.message
//         })
//     })
// })



module.exports=Router;
