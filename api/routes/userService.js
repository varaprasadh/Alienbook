const Router = require('express').Router();
const User = require("../models/User");
const bcrypt=require('bcrypt');
const attachUserInfo = require("./middlewares/attachUserInfo");
const getUserProfile = require("./helper/getUserProfile");
const LIMIT=20;
const multer = require("multer")();

const {uploadImages,uploadProfileImage,deleteImages} =require("./imageService/index");

//getting users 
//excluding current user
Router.get("/", attachUserInfo,(req, res) => {
  const skip=parseInt(req.query.skip) || 0;
  const current_user_id=req.user.id;
  User.aggregate([
     {
         $match:{
           id: {
               $ne: current_user_id
           }
         }
     }, {
         $lookup: {
             from: "relations",
             localField: "id",
             foreignField: "target",
             as: "follower_followers"
         },
     },
      {
          $addFields: {
              follower_followers: {
                  $filter: {
                      input: "$follower_followers",
                      cond: {
                          $eq: ["$$this.status", "following"]
                      }
                  }
              }
          }
      },
      {
        $project:{
            username:1,
            fullName:1,
            id:1,
            amIFollowing: {
                $in: [current_user_id, "$follower_followers.source"]
            },
        }
      },
     {
         $sort:{
             amIFollowing:1
         }
     }
  ]).skip(skip).limit(LIMIT).then(users => {
      res.status(200).json({
          users:users,
          finished:users.length<LIMIT
      })
  }).catch(err=>{
      res.status(400).json({
          error:err.message
      })
  })
});


// get user info for single user
Router.get("/profile/:username?", attachUserInfo, (req, res) => {
    const username=req.params.username || req.user.info.username;
     const userid = req.user.id;
    getUserProfile(username, userid).then(userprofile => {
        res.status(200).json({
            data:userprofile
        })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
})

//updates the profile
Router.post("/profile", multer.single("image"),async (req, res) => {
    const userid=req.user.id;
    const {fullName,username}=req.body;
    const profileImage=req.file;
    console.log(fullName,username);
    try{
        if (!fullName || !username) {
           throw new Error("username or fullname is not valid");
        }
        const meta=await uploadProfileImage(profileImage,userid);

        console.log(meta);
        const status=await User.findOneAndUpdate({id:userid},{fullName,username});

        const userProfile=await getUserProfile(username,userid);
        res.status(200).json({
            profile:userProfile
        });

        
    }catch(err){
         res.status(400).json({
             error: err.message
         })
    }
});

module.exports=Router;