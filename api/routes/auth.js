const Router=require('express').Router();
const User=require('../models/User');
const uuid = require('uuid').v1;

const authenticateUser=require("./mdl_authenticate");
const registerUser=require("./mdl_registerUser");
const OAuthSigupHelper=require("./mdl_OAuthSigupHelper");
const getWebToken=require('./helper/createJWT');

const bcrypt=require('bcrypt');

const transporter = require("../mail_transporter");


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
const verifyOTP = async (req, res, next) => {
    const {
        otpHash,
        otp
    } = req.body;
    let isValid = false;
    try {
        isValid = await bcrypt.compare(otp, otpHash);
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: "something went wrong,try again later"
        });
    }
    console.log("otp from cleint is", otp, isValid);
    if (!isValid) {
        return res.status(400).json({
            success: false,
            error: "wrong OTP"
        })
    }
    next();
}
const verifyEmail=async (req,res,next)=>{
 const {email}=req.body;
  let user=await User.findOne({email});
  if(user){
      return res.status(400).json({
        error:"email is already in use"
      })
  }
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


Router.post('/signup',verifyEmail,verifyUsername,verifyOTP,OAuthSigupHelper, registerUser, validateUser, (req, res) => {
    // console.log(req.user);
    const {user}=req;
    token=getWebToken(user);
    res.status(200).json({
        success:true,
        token
    })
});
Router.post("/signin", authenticateUser, validateUser, (req, res) => {
    // console.log(req.user);
    const {user}=req;
    token = getWebToken(user);
    res.status(200).json({
        success:true,
        token
    });
});

Router.post("/reset",(req,res)=>{
  const {username}=req.body;
  User.findOne({username}).then(async user=>{
      if(!user) throw new Error("username does'nt exit");
      const {email}=user;
      if(!email) throw new Error("email doenst exist");
      const otp=generateOTP();
      console.log("new otp is: ",otp);
     

       let options = {
            from: process.env.APP_EMAIL,
            to: email, // list of receivers
            subject: "reset password support", // Subject line
            text: `here is your otp for resetting your intellias account password: ${otp} \n do not share this with anyone`, // plain text body
            html: `<b>here is the otp for resetting your intellias account</b> <br/>
                     <h1>${otp}</h1>
                   <b>dont share this with anyone!</b>`, // html body
        }
        // send mail with defined transport object
        let mail_transporter_status;
        try{
            mail_transporter_status=await transporter.sendMail(options)
        }catch(err){
            console.error(err);
            return res.status(400).json({
                success:false,
                error:"something went wrong,try again later"
            });
        }
     const otpHash = await bcrypt.hash(otp, 10);
     res.status(200).json({
          success:true,
          otpHash: otpHash
      });
  }).catch(err=>{
      res.status(400).json({
          success:false,
          error:err.message
      });
  })
});



Router.post("/reset/verifyOTP",verifyOTP,(req,res)=>{
    res.json({
        success:true
    });
});

Router.post("/reset/updatePassword",verifyOTP,async (req,res)=>{
    const {username,password}=req.body;
    User.findOneAndUpdate({username},{password:password}).then(user=>{
        if(!user){
            throw new Error("user doen not exist");
        }
        res.json({
            success:true,
            message:"password updated successfully"
        });
    })
})

function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}


Router.post("/getOTP", verifyEmail,verifyUsername,async(req, res) => {
    const {email}=req.body;
    
    if(!email) throw new Error("email required");
    const otp = generateOTP();
    console.log("new otp is: ", otp);
    let options = {
        from: process.env.APP_EMAIL,
        to: email, // list of receivers
        subject: "OTP for AlienBook registration", // Subject line
        text: `here is your otp : ${otp} \n do not share this with anyone`, // plain text body
        html: `<b>here is the otp</b> <br/>
                     <h1>${otp}</h1>
                   <b>dont share this with anyone!</b>`, // html body
    }
    // send mail with defined transport object
    let mail_transporter_status;
    try {
        mail_transporter_status = await transporter.sendMail(options)
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            error: "something went wrong,try again later"
        });
    }
    const otpHash = await bcrypt.hash(otp, 10);
    res.status(200).json(
        {
            success: true,
            otpHash: otpHash
        });
})
module.exports=Router;
