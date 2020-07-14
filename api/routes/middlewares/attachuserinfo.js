
const User=require("../../models/User");

const retrieveUserInfo = (req, res, next) => {
    User.findOne({
        id: req.user.id
    }).then(user => {
        if (!user) throw new Error("user doenst exist");
        req.user.info = user;
        next();
    }).catch(err => {
        res.status(404).json({
            success: false
        });
    })
}

module.exports=retrieveUserInfo;