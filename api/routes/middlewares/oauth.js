const User=require("../../models/User");
const getWebToken=require("../helper/createJWT");
let website="";

if(process.env.MODE==="production"){
    website=process.env.WEB_PROD_SERVER;
}else{
    website=process.env.WEB_DEV_SERVER
}


const oauth=(req,res)=>{
        let boardinguser = req.user;
        let open_id = boardinguser.id;
        User.findOne({
            open_id
        }).then(user => {
            if (user) {
                //take him to processing page to generate jwt
                let encodedToken = encodeURIComponent(getWebToken(user));
                res.redirect(`${website}/signin/saveToken?token=${encodedToken}`)
            } else {
                let tempdata = {
                    open_id: boardinguser.id,
                    fullName: boardinguser.displayName,
                }
                let encoded = encodeURIComponent(JSON.stringify(tempdata));
                res.redirect(`${website}/signup/createuserame?data=${encoded}`);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).end();
        })
}
module.exports={oauth};
