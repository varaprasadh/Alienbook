const query_conversations=(user_id,skip=0,limit=20)=>(
   [{
           $match: {
               $and: [{
                       participents: {
                           $in: [user_id]
                       }
                   },
                   {
                       deleted_by: {
                           $ne: user_id
                       }
                   }
               ]
           }
       },
       {$skip:skip},
       {
           $limit:limit
       },
       {
           $lookup: {
               from: "users",
               localField: "participents",
               foreignField: "id",
               as: "_participents"
           }
       },
       {
           $lookup: {
               from: "messages",
               let: {
                   "id": "$id"
               },
               pipeline: [{
                       $match: {
                           $expr: {
                               $in: ["$conversation_id", ["$$id"]]
                           },

                           deleted_by: {
                               $ne: user_id
                           }

                       }
                   },
                   {
                       $sort: {
                           created_at: -1
                       }
                   },
                   {
                       $limit: 1
                   },
                   {
                       $lookup: {
                           from: "users",
                           localField: "sender_id",
                           foreignField: "id",
                           as: "sender"
                       }
                   },
                   {
                       $unwind: "$sender"
                   },
                   {
                       $project: {
                           _id: 0,
                           id: 1,
                           conversation_id: 1,
                           read_by: 1,
                           deleted_by: 1,
                           from: {
                               id: "$sender.id",
                               username: "$sender.username",
                               fullname: "$sender.fullName",
                               avatar: {
                                   $ifNull: ["$sender.pictures.profile.url", null]
                               }
                           },
                           message: {
                               content: "$content",
                               timestamp: "$created_at"
                           }
                       }
                   }
               ],
               as: "messages"
           }
       },
       {
           $project: {
               _id: 0,
               id: 1,
               messages: 1,
               created_at: 1,
               is_group: 1,
               participants: {
                   $map: {
                       input: "$_participents",
                       as: "participent",
                       in: {
                           username: "$$participent.username",
                           fullname: "$$participent.fullName",
                           id: "$$participent.id",
                           avatar: {
                               $ifNull: ["$$participent.pictures.profile.url", null]
                           }
                       }
                   }

               }
           }
       }
   ]
);

const query_get_coversation=(user_id,conversation_id)=>(
[
    {
        $match: {
           id:conversation_id
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "participents",
            foreignField: "id",
            as: "_participents"
        }
    },
    {
        $lookup: {
            from: "messages",
            let: {
                "id": "$id"
            },
            pipeline: [{
                    $match: {
                        $expr: {
                            $in: ["$conversation_id", ["$$id"]]
                        },

                        deleted_by: {
                            $ne: user_id
                        }

                    }
                },
                {
                    $sort: {
                        created_at: -1
                    }
                },
                {
                    $limit: 1
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "sender_id",
                        foreignField: "id",
                        as: "sender"
                    }
                },
                {
                    $unwind: "$sender"
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        conversation_id: 1,
                        read_by: 1,
                        deleted_by: 1,
                        from: {
                            id: "$sender.id",
                            username: "$sender.username",
                            fullname: "$sender.fullName",
                            avatar: {
                                $ifNull: ["$sender.pictures.profile.url", null]
                            }
                        },
                        message: {
                            content: "$content",
                            timestamp: "$created_at"
                        }
                    }
                }
            ],
            as: "messages"
        }
    },
    {
        $project: {
            _id: 0,
            id: 1,
            messages: 1,
            created_at: 1,
            is_group: 1,
            participants: {
                $map: {
                    input: "$_participents",
                    as: "participent",
                    in: {
                        username: "$$participent.username",
                        fullname: "$$participent.fullName",
                        id: "$$participent.id",
                        avatar: {
                            $ifNull: ["$$participent.pictures.profile.url", null]
                        }
                    }
                }

            }
        }
    }
]
)

module.exports={
    query_conversations,
    query_get_coversation
}
