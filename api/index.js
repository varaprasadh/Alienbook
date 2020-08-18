const express=require('express');
const Auth =require("./routes/auth");
const PostService = require('./routes/PostService');
const LikeHandler=require("./routes/LikeHandler");
const CommentHandler=require("./routes/commentHandler");
const cors=require('cors');
const dotEnv=require('dotenv');

const verifyAndAttachUser = require("./routes/verifyAndAttachUser");

const attachUserInfo=require("./routes/middlewares/attachuserinfo");

const userService =require("./routes/userService");
const shareService=require("./routes/ShareService");
const saveService = require("./routes/saveService");


const  LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const passport=require('passport');
const User=require("./models/User");
const FollowManager =require("./routes/FollowManager");
const NotificationHandler=require("./routes/NotificationsHandler");
const {oauth}=require("./routes/middlewares/oauth");

const getWebToken=require("./routes/helper/createJWT");

dotEnv.config();

const connection=require('./dbconnection');

connection.then((conn)=>{
    console.log("db connected");
}).catch(err=>{
    console.log("db error:" ,err);
})


require("./Triggers/Notifications/Reaction.js");


const messagingService =require("./routes/Messaging/index");



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

app.use("/chat",messagingService);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK,
    scope: ['r_emailaddress', 'r_liteprofile'],
    
},(accessToken,refreshToken,profile,done)=>{
   done(null,profile);
}));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
    },
    function (accessToken, refreshToken, profile, done) {
     done(null,profile) 
    }
));
passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_APP_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK,
                scope:["profile"]
            }, (_, __, profile, done) => {
                    done(null, profile);
            }))

app.use(passport.initialize());


app.get('/auth/facebook',passport.authenticate('facebook'));
app.get('/auth/linkedin',passport.authenticate('linkedin'));
app.get('/auth/google',  passport.authenticate('google'));


app.get('/auth/facebook/callback', passport.authenticate('facebook'),oauth);
app.get('/auth/linkedin/callback', passport.authenticate('linkedin'),oauth);
app.get('/auth/google/callback', passport.authenticate('google'), oauth);


const PORT=process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server listeing at port ${PORT}..`);
})