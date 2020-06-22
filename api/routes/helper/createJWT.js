 const jwt = require('jsonwebtoken');
 
 const getWebToken = (user) => {
     let payload = {
         username: user.username,
         id: user.id,
         role: user.Role
     }
     let token = jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN)
     return token;
 }
 module.exports=getWebToken;