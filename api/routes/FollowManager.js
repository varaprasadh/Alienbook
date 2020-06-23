const Router = require('express').Router();
const User = require('../models/User');


//@many to many connection
Router.post("/follow",async (req,res)=>{
   const current_user_id=req.user.id; //current guy
   const followee_id=req.body.userId; //other guy

   try{
    const current_user=await User.findOne({id:current_user_id});
    const other_user=await User.findOne({id:followee_id});
    if(!current_user || !other_user){
        throw new Error("either of user doesnt exsit");
    }
    current_user.following.addToSet(followee_id); //adding to following list
    other_user.followers.addToSet(current_user_id); //adding to other guys follower list
    await current_user.save();
    await other_user.save();
    res.status(200).json({
        message: "user being followed"
    })
   }catch(err){
        res.status(400).json({
            error: err.message
        })
   }
})

Router.post("/unfollow",async (req,res)=>{
   const current_user_id=req.user.id; //current guy
   const followee_id=req.body.userId; //other guy
   try{
    const current_user=await User.findOne({id:current_user_id});
    const other_user=await User.findOne({id:followee_id});
    if(!current_user || !other_user){
        throw new Error("either of user doesnt exsit");
    }
    console.log(current_user);
    console.log(other_user);

    current_user.following.pull(followee_id); //adding to following list
    other_user.followers.pull(current_user_id); //adding to other guys follower list
    await current_user.save();
    await other_user.save();
    res.status(200).json({
        message:"user being unfollowed"
    })
   }catch(err){
        res.status(400).json({
            error: err.message
        })
   }

})

//get users followed by this user
Router.get("/following/:username",async (req,res)=>{
  const username = req.params.username;
  const current_user_id=req.user.id;
  const skip=parseInt(req.query.skip) || 0 //for infinite fetching 
  try{
    const target_user=await User.findOne({username:username});
    const current_user=await User.findOne({id:current_user_id});

    if(!target_user || !current_user){
        throw new Error("either of user doesnt exsit");
    }
    const following=await User.aggregate([
   {
        $match:{
            id:{
                $in:target_user.following
            }
        }
    },
    {
      $project:{
          username:1,
          fullName: 1,
          id:1,
          amIFollowing:{
              $in:[current_user_id,"$followers"]
          },
          isIam: {
            $eq: [current_user_id, "$id"]
          }
      }
    }
    ]);
   res.status(200).json({
       users:following,
       finished: following.length < 20
   })
  }catch(err){
      res.status(400).json({
          error:err.message
      });
  }
});

//get users followed by this user
Router.get("/followers/:username", async (req, res) => {
  const username = req.params.username;
  const current_user_id=req.user.id;
  const skip=parseInt(req.query.skip) || 0 //for infinite fetching 
  try{
    const target_user=await User.findOne({username:username});
    const current_user=await User.findOne({id:current_user_id});

    if(!target_user || !current_user){
        throw new Error("either of user doesnt exsit");
    }
    const followers=await User.aggregate([
   {
        $match:{
            id:{
                $in:target_user.followers
            }
        }
    },
    {
      $project:{
          
          id:1,
          username: 1,
          fullName:1,
          amIFollowing:{
              $in:[current_user_id,"$followers"]
          },
          isIam:{
              $eq:[current_user_id,"$id"]
          }
      }
    }
    ]);
   res.status(200).json({
       users:followers,
       finished:followers.length<20
   })
  }catch(err){
      res.status(400).json({
          error:err.message
      });
  }
});


module.exports=Router;
