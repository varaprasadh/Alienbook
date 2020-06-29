const User = require("../../models/User");

 const getUserProfile=(username)=>{
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
