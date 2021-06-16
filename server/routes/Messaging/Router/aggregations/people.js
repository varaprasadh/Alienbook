
const query_people =(q_name,current_username) => [{
    $match: {
        $or: [{
                username: {
                    $regex: q_name,
                    '$options': 'i'
                }
            },
            {
                fullName: {
                    $regex: q_name,
                    '$options': 'i'
                }
            }
        ]
    }
}, 
{
    $match: {
        username: {
            $ne: current_username
        }
    }
},
{
    $project: {
        full_name: "$fullName",
        username: 1,
        id: 1,
        avatar_url: {
            $ifNull: ["$pictures.profile.url", null]
        }
    }
}
];
const query_people_recommended = (username) => [{
        $match: {
            username: {
                $ne: username
            }
        }
    }, {
        $lookup: {
            from: "relations",
            localField: "id",
            foreignField: "target",
            as: "follower_followers"
        },
    },
    {
        $addFields: {
            follower_followers: {
                $filter: {
                    input: "$follower_followers",
                    cond: {
                        $eq: ["$$this.status", "following"]
                    }
                }
            }
        }
    },
{
    $project: {
        full_name: "$fullName",
        username: 1,
        id: 1,
        avatar_url: {
            $ifNull: ["$pictures.profile.url", null]
        }
    }
}
];
const query_people_get_by_ids=(user_ids)=>[
    {
        $match: {
            id: {
                $in: user_ids
            }
        }
    }, {
        $project: {
            full_name: "$fullName",
            username: 1,
            id: 1,
            avatar: {
                $ifNull: ["$pictures.profile.url", null]
            }
        }
    }
];

module.exports={
    query_people,
    query_people_recommended,
    query_people_get_by_ids
}
