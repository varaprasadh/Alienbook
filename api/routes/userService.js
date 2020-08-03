const Router = require('express').Router();
const User = require("../models/User");
const bcrypt=require('bcrypt');
const attachUserInfo = require("./middlewares/attachUserInfo");
const getUserProfile = require("./helper/getUserProfile");
const LIMIT=20;


//getting users 
//excluding current user
Router.get("/", attachUserInfo,(req, res) => {
  const skip=parseInt(req.query.skip) || 0;
  const current_user_id=req.user.id;
  User.aggregate([
     {
         $match:{
             $and:[
                 {
                    id: {
                        $ne: current_user_id
                    }
                 },
                 {
                    id: {
                        $nin: req.user.info.following
                    }
                 }
             ]
         }
     },
      {
        $project:{
            username:1,
            fullName:1,
            id:1,
            amIFollowing:{
                $in:[current_user_id,"$followers"]
            }
        }
      },
     
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
Router.post("/profile",(req,res)=>{
    const userid=req.user.id;
    const {fullName,username}=req.body;
    User.findOneAndUpdate({id:userid},{fullName,username}).then((status)=>{
       getUserProfile(username, userid).then(user => {
           res.status(200).json({
            profile:user
        })
       })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
});


module.exports=Router;