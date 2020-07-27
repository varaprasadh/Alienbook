const User=require("../../models/User");
const getWebToken=require("../helper/createJWT");

//get some solution
const referer="http://localhost:8080";

const oauth=(req,res)=>{
    let boardinguser = req.user;
    let open_id = boardinguser.id;
   
    User.findOne({
        open_id
    }).then(user => {
        if (user) {
            //take him to processing page to generate jwt
            let encodedToken = encodeURIComponent(getWebToken(user));
            res.redirect(`${referer}/signin/saveToken?token=${encodedToken}`)
        } else {
            let tempdata = {
                open_id: boardinguser.id,
                fullName: boardinguser.displayName,
            }

            let encoded = encodeURIComponent(JSON.stringify(tempdata));
            res.redirect(`${referer}/signup/createuserame?data=${encoded}`);
        }
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    })
}
module.exports={oauth};
