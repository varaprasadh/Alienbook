const User = require('../models/User');
const uuid = require('uuid').v1;
const registerUser=(req,res,next)=>{
  const {email,fullName,username,password,security_question,security_answer,thirdPartyAuthId} = req.body;
   User.findOne({username}).then(user=>{
       if(user) throw new Error('username exists');
       const newUser=new User({
           id:uuid(),
           email,
           fullName,
           username,
           password,
           thirdPartyAuthId
       });
       return newUser.save().then(user => {
           req.user=user;
           next();
       }).catch(err=>{
          throw new Error(err);
       })
   }).catch(err=>{
       res.status(400).json({
           success:false,
           error:err.message
       })
   })
}


module.exports = registerUser;