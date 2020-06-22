const jwt=require('jsonwebtoken');

const verifyAndAttachUser = (req, res, next)=>{
       let header = req.headers.authorization || null;
       let token=header && header.split("Bearer ")[1];
       try{
         let payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
         req.user=payload;
       //   console.log(payload,"attacked");
         next();
       }catch(err){
              req.user=null;
              res.status(401).json({
                     success:false,
                     error:"not authorized"
              });
       }  
}
module.exports = verifyAndAttachUser;
