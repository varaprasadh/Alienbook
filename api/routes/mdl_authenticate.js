const User = require('../models/User');

const authenticateUser=(req,res,next)=>{
   const {username,password}=req.body;
   User.findOne({username}).then(user=>{
        if(!user) throw new Error("user doesn't exist!");
        if(user.password===password){
            req.user=user;
        }else{
            throw new Error("password does'nt match!");
        }
        next();
    }).catch(err=>{
        req.user=null;
        next();
    })
}
module.exports=authenticateUser;