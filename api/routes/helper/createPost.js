const uuid = require('uuid').v1;
const Post = require("../../models/Post");

const postTypes = {
    NORMAL: "NORMAL",
    SHARE: "SHARE"
}

const createPost = async (postData) => {
  //@param refId is the referrence of original id if post is the shared one
  const {content="",author,type=postTypes.NORMAL,refID=""}=postData;
  let post=new Post({
      id:uuid(),
      content,
      author,
      refId
  });
   return new Promise((resolve,reject)=>{
        post.save().then(post=>{
            let result = {
                ...post._doc,
                likes: post.likes.length,
                comments: post.comments.length
            }
            resolve(result);
        }).catch(err=>{
          reject(err);
        })
   })
}
module.exports={createPost}
