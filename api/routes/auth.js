const Router=require('express').Router();
const User=require('../models/User');
const uuid = require('uuid').v1;

const registerUser=require("./middlewares/registerUser");
const getWebToken=require('./helper/createJWT');

const validateUser=(req,res,next)=>{
  const {user}=req;
    if(!user){
      return res.status(401).json({
          success:false,
          error:"user does'nt exist"
      });
    };
    next();
}

const verifyUsername=async (req,res,next)=>{
 const {username}=req.body;
  let user=await User.findOne({username});
  if(user){
      return res.status(400).json({
        error:"username is already in use"
      })
  }
  next();
}
Router.post("/checkusername", verifyUsername,(req, res) => {
    res.status(200).json({
        available:true
    })
})


Router.post('/signup', registerUser, validateUser, (req, res) => {
    // console.log(req.user);
    const {user}=req;
    token=getWebToken(user);
    res.status(200).json({
        success:true,
        token
    })
});

module.exports=Router;
