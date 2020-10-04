const Router = require('express').Router();
const User = require('../models/User');

const Relation = require("../models/Relation");



Router.post("/follow",async (req,res)=>{
    const source=req.user.id;
    const target=req.body.userId;
    try{
        let relation=await Relation.findOne({source,target});
        if(!relation){
           relation=new Relation({source,target}); 
        }
        relation.status="following";
        await relation.save();
        res.status(200).json({
            message:"success"
        });
    }catch(err){
        res.status(400).json({
            error:err.message
        })
    }
})

Router.post("/unfollow",async (req,res)=>{
    const source=req.user.id;
    const target=req.body.userId;
    try{
        let relation=await Relation.findOne({source,target});
        if(relation){
           relation.status="not follow";
        }
        await relation.save();
        res.status(200).json({
            message:"user being unfollowd"
        })
    }catch(err){
        res.status(400).json({
            error:err.message
        });
    }
})


Router.get("/following/:username",async (req,res)=>{
  const username = req.params.username;
  const current_user_id=req.user.id;
  const skip=parseInt(req.query.skip) || 0 ;
  Relation.aggregate([
      {
          $match:{
              source: current_user_id,
              status:"following"
          }
      },
      {
         $lookup:{
             from:"users",
             localField:"target",
             foreignField:"id",
             as:"person"
         }
      },
      {
        $unwind:"$person"
      },
      {
          $project:{
            id: "$person.id",
            username:"$person.username",
            fullName: "$person.fullName",
            amIFollowing:{
                $literal:true
            },
            isIam: {
                $eq: [current_user_id, "$person.id"]
            }
          }
      }
  ]).skip(skip).limit(20).then((records)=>{
       res.status(200).json({
           users:records,
           finished:records.length<20
        })
    }).catch(err => {
        res.status(400).json({
            error: err.message
        })
    });
})


Router.get("/followers/:username",async (req,res)=>{
    const username=req.params.username;
    const current_user_id=req.user.id;
    const skip=parseInt(req.query.skip) || 0;
     Relation.aggregate([
       {
           $match:{
               target:current_user_id,
               status:"following"
           }
       },
       {
        $lookup:{
            from:"users",
            localField:"source",
            foreignField:"id",
            as:"person"
        },
    
       },
        {
            $unwind: "$person"
        },
        {
            $lookup: {
                from: "relations",
                localField: "source",
                foreignField: "target",
                as: "follower_followers"
            },
        }, {
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
            $project: {
                id: "$person.id",
                username: "$person.username",
                fullName: "$person.fullName",
                amIFollowing: {
                    $in: [current_user_id, "$follower_followers.source"]
                },
                isIam: {
                    $eq: [current_user_id, "$person.id"]
                }
            }
        }
     ]).skip(skip).limit(20).then((records)=>{
        res.status(200).json({
            users:records,
            finished:records.length<20
        })
     }).catch(err=>{
         res.status(400).json({
             error:err.message
         })
     })
})


module.exports=Router;
