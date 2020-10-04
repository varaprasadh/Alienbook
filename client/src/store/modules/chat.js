export default {
    namespaced:true,
    state:{
      appName:"chat",
      channels:[
          {
          participents:[{
            username:"john_doe",
            fullName:"John wellick doe",
            avatar:"link",
            user_id:"1234"
          },
          {
          participents:[{
            username:"john_doe",
            fullName:"John wellick doe",
            avatar:"link"
          }
        ],
        lastMessage:{
            from:"username",
            content:"hello world",
            timestamp:"2 mins ago"
        },
        messages:[
            {
                from:{
                    username:"johndoe",
                    user_id:"1234",
                    avatar:"",
                    fullName:""
                },
                message:{
                    content:"hello"
                }
            }
        ]
      }]
    }]
    },
    actions:{

    },
    mutations:{

    },
    getters:{

    }

}