const Post = require("../../models/Post");

const getPost = (postid, current_user_id) => {
    return new Promise((resolve, reject) => {
        Post.aggregate([{
                $match: {
                    id: postid
                }
            },
             {
                $lookup: {
                    "from": "users",
                    "localField": "author",
                    "foreignField": "id",
                    "as": "authorData"
                }
            }, {
                $unwind: {
                  path:"$authorData",
                  preserveNullAndEmptyArrays: true,
                },
               
            }, {
                $lookup: {
                    "from": "posts",
                    "localField": "refId",
                    "foreignField": "id",
                    "as": "sharedContent"
                }
            }, {
                $unwind: {
                    preserveNullAndEmptyArrays: true,
                    path: "$sharedContent"
                }
            }, {
                $lookup: {
                    "from": "users",
                    "localField": "sharedContent.author",
                    "foreignField": "id",
                    "as": "prim_author"
                }
            }, {
                $unwind: {
                    path: "$prim_author",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    "from": "users",
                    "localField": "ref_author",
                    "foreignField": "id",
                    "as": "ref_author"
                }
            }, {
                $unwind: {
                    path: "$ref_author",
                    preserveNullAndEmptyArrays: true
                }
            },
             {
                $lookup: {
                    "from": "reactions",
                    "localField": "id",
                    "foreignField": "parent",
                    "as": "reactions"
                }
            },
             {
                $lookup: {
                    "from": "comments",
                    "localField": "id",
                    "foreignField": "post_id",
                    "as": "comments"
                }
            },
            {
                $addFields: {
                    reaction: {
                        $filter: {
                            input: "$reactions",
                            cond: {
                                $eq: ["$$this.user_id", current_user_id]
                            }
                        }
                    }
                }
            },
             {
                $unwind: {
                     path: "$reaction",
                     preserveNullAndEmptyArrays: true
                 }
             },
            {
                $project: {
                    id: 1,
                    content: 1,
                    reactions:{
                        $size:"$reactions"
                    },
                    
                    comments:{
                        $size:"$comments"
                    },
                    "reaction.type": 1,
                    refId: 1,
                    ref_author_username: 1,
                    type: 1,
                    author: 1,
                    createdAt: 1,
                    authorName: "$authorData.username",
                    ref_author_username: "$ref_author.username",
                    originalPost: {
                        $cond: {
                            if: {
                                $ne: ["$sharedContent", undefined]
                            },
                            then: {
                                content: "$sharedContent.content",
                                createdAt: "$sharedContent.createdAt",
                                id: "$sharedContent.id",
                                author: "$sharedContent.author",
                                authorName: "$prim_author.username"
                            },
                            else: null
                        }
                    },
                    images: {
                        $map: {
                            input: "$images",
                            as: "meta",
                            in: "$$meta.url"
                        }
                    },
                }
            }
        ]).limit(1).then(([post]) => {
            if (!post) throw new Error("post does'nt exist");
             post.amIReacted = post.reaction != null;
             post.reaction = post.reaction || null;
            resolve(post)
        }).catch(err => {
            reject(err);
        })
    })
}
module.exports=getPost;
