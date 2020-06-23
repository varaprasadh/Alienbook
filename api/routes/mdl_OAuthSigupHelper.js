const crypto = require('crypto');


const OAuthSigupHelper=(req,res,next)=>{
    let {id,password}=req.body;
    // as the password field required for user model,generate useless password
    password=password || crypto.randomBytes(16).toString('utf-8');
    let thirdPartyAuthId=id;
    req.body = {
        ...req.body,
        password,
        thirdPartyAuthId,
    }
    next();
}
module.exports = OAuthSigupHelper;
