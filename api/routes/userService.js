const Router = require('express').Router();
const User = require("../models/User");
const bcrypt=require('bcrypt');


const LIMIT=20;


//getting users 
//excluding current user
Router.get("/",(req,res)=>{
  const skip=req.query.skip || 0;
  const current_user_id=req.user.id;
  console.log("debug",req.user);
  User.aggregate([
      {
       $match:{
            id: {
                $ne: current_user_id
            }
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
          completed:user.length<LIMIT
      })
  }).catch(err=>{
      res.status(400).json({
          error:err.message
      })
  })
});






// get user info for single user
Router.get("/profile/:username",(req,res)=>{
 const username=req.params.username;
 User.aggregate([
     {
     $match:{
         username:{
             $eq:username
         }
     }
    },
    {
        $lookup: {
            "from": "posts",
            "localField": "id",
            "foreignField": "author",
            "as": "posts"
        }
    },
    {
        $project:{
           username:1,
           fullName:1,
           id:1,
           createdAt:1,
           following:{
               $size:"$following"
           },
           followers: {
               $size: "$followers"
           },
           posts:{
               $size:"$posts"
           }
        }
    }
 ]).limit(1).then(([user])=>{
     if(!user){
         throw new Error("user doesn't exist");
     }
     res.status(200).json({
         data:user
     })
 }).catch(err=>{
     res.status(404).json({
         error:err.message
     })
 })
})


Router.post("/profile",(req,res)=>{
    const userid=req.user.id;
    const {fullName,username,bio}=req.body;
    User.findOneAndUpdate({id:userid},{fullName,username,bio}).then((status)=>{
       res.status(200).json({
           message:"profile has been updated"
       });
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