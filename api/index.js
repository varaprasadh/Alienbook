const express=require('express');
const mongoose=require('mongoose');
const Auth =require("./routes/auth");
const PostService = require('./routes/PostService');
const LikeHandler=require("./routes/LikeHandler");
const CommentHandler=require("./routes/commentHandler");
const cors=require('cors');
const dotEnv=require('dotenv');

const verifyAndAttachUser = require("./routes/verifyAndAttachUser");

const attachUserInfo=require("./routes/mdl_attachuserinfo");

const userService =require("./routes/userService");
const shareService=require("./routes/ShareService");
const saveService = require("./routes/saveService");


const  LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const passport=require('passport');
const User=require("./models/User");
const FollowManager =require("./routes/FollowManager");
const NotificationHandler=require("./routes/NotificationsHandler");

const getWebToken=require("./routes/helper/createJWT");

dotEnv.config();


mongoose.connect('mongodb://localhost:27017/intellias', {useNewUrlParser: true,useUnifiedTopology:true});


const app=express();



app.set("query parser","extended");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());



app.use("/auth",Auth);
app.use("/posts", verifyAndAttachUser, attachUserInfo, PostService); 
app.use("/users", verifyAndAttachUser, userService);
app.use("/post", verifyAndAttachUser,shareService);
app.use('/post', verifyAndAttachUser, LikeHandler);
app.use("/post", verifyAndAttachUser, CommentHandler);
// app.use("/post",verifyAndAttachUser,saveService);
app.use("/users", verifyAndAttachUser, FollowManager);
app.use("/notifications",verifyAndAttachUser,NotificationHandler);


passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: "http://localhost:3000/auth/linkedin/callback/",
    scope: ['r_emailaddress', 'r_liteprofile'],
    
},(accessToken,refreshToken,profile,done)=>{
   done(null,profile);
}));
app.use(passport.initialize());


app.get('/auth/linkedin',passport.authenticate('linkedin'));
  


app.get('/auth/linkedin/callback', passport.authenticate('linkedin'),(req,res)=>{
    //the auth data available in req.user
    let boardinguser=req.user;
    let thirdPartyAuthId = boardinguser.id;
   
    User.findOne({thirdPartyAuthId}).then(user=>{
        if(user){
            //take him to processing page to generate jwt
         let encodedToken = encodeURIComponent(getWebToken(user));
         res.redirect(`http://localhost:8080/signin/saveToken?token=${encodedToken}`)
        }else{
            let tempdata = {
                id: boardinguser.id,
                fullName: boardinguser.displayName,
                email: boardinguser.emails[0].value
            }

            let encoded = encodeURIComponent(JSON.stringify(tempdata));
            res.redirect(`http://localhost:8080/signup/createuserame?data=${encoded}`);
        }
    }).catch(err=>{
         res.status(500).end();
    })
});

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server listeing at port ${PORT}..`);
})