const User=require("../../models/User");
const getWebToken=require("../helper/createJWT");


const oauth=(req,res)=>{
    let boardinguser = req.user;
    let open_id = boardinguser.id;

    const referer = new URL(req.headers.referer).origin;

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
