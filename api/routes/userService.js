const Router = require('express').Router();
const User = require("../models/User");
const bcrypt=require('bcrypt');
const retrieveUserInfo=require("./mdl_attachuserinfo");
const getUserProfile = require("./helper/getUserProfile");
const LIMIT=20;


//getting users 
//excluding current user
Router.get("/",(req,res)=>{
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
                        $nin: [current_user_id, "$followers"]
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
Router.get("/profile/:username?", retrieveUserInfo, (req, res) => {
    const username=req.params.username || req.user.info.username;
    getUserProfile(username).then(userprofile=>{
        res.status(200).json({
            data:userprofile
        })
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
})


Router.post("/profile",(req,res)=>{
    const userid=req.user.id;
    const {fullName,username}=req.body;
    User.findOneAndUpdate({id:userid},{fullName,username}).then((status)=>{
       getUserProfile(username).then(user=>{
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
Router.post("/profile/changepwd",async (req,res)=>{
    const userid=req.user.id;
    const {current_password,new_password}=req.body;
    User.findOne({id:userid}).then(user=>{
        if(!user) throw new Error("user not found");
        // const isPasswordValid=bcrypt.compareSync(current_password,user.password);


        const isPasswordValid=current_password===user.password;
        if(!isPasswordValid){
            throw new Error("invalid password");
        }
        user.password=new_password;
        user.save().then(()=>{
            res.status(200).json({
                message:"password had been updated"
            })
        })
        
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    })
})



module.exports=Router;