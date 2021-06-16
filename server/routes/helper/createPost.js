const uuid = require('uuid').v1;
const Post = require("../../models/Post");

const postTypes = {
    NORMAL: "NORMAL",
    SHARE: "SHARE"
}

const createPost = (postData) => {
  let post=new Post({
      id:uuid(),
      ...postData
  });
   return new Promise((resolve,reject)=>{
        post.save().then(post=>{
            resolve(post);
        }).catch(err=>{
          console.log(err);
          reject(err);
        })
   })
}
const formatPost = post =>{
    return {
        ...post._doc,
        likes: post._doc.likes.length,
        comments: post._doc.comments.length,
    }
};

module.exports = {
    createPost,
    formatPost
}
