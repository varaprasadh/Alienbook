const User = require("../../models/User");

 const getUserProfile=(username,current_user_id)=>{
       console.log("debug",current_user_id);
       return new Promise((resolve,reject)=>{
            User.aggregate([{
                    $match: {
                        username: {
                            $eq: username
                        }
                    }
                },
                {
                    $lookup: {
                        "from": "posts",
                        "localField": "id",
                        "foreignField": "author",
                        "as": "posts"
                    }
                },
                {
                    $project: {
                        username: 1,
                        fullName: 1,
                        id: 1,
                        createdAt: 1,
                        following: {
                            $size: "$following"
                        },
                        followers: {
                            $size: "$followers"
                        },
                        posts: {
                            $size: "$posts"
                        },
                        amIFollowing:{
                            $in:[current_user_id,"$followers"]
                        },
                        isSelf:{
                            $eq:[current_user_id,"$id"]
                        }
                    }
                }
            ]).limit(1).then(([user]) => {
                if (!user) {
                    reject(new Error("user doesn't exist"));
                }
               resolve(user);
            }).catch(err => reject(err));
       })
 }
 module.exports=getUserProfile;
