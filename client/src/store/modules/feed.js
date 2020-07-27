/* eslint-disable no-unused-vars */
import Axios from "axios";

export default {
    namespaced:true,
    state:{
        posts: [],
        skip:0,
        completed:false,
        loading:false,
    },

    actions:{
        loadFeed({commit,state}) {
            if (state.loading || state.completed) {
                return;
            }
            state.loading = true;
            Axios.get("/posts", {params: {skip: state.skip}}).then(({data}) => {
                commit('setPosts',data.posts);
                state.completed = data.completed;
                state.skip += 20;
            }).catch(() => {}).finally(() => {
                state.loading = false;
            })
        },
        publishPost({commit},payload){
           console.log(payload);
            console.log("here");
           const {content} =payload;
           if(content.trim()===""){
               return;
           }
           commit("rungl_loader",null,{root:true});
           commit("editor/closeEditor",null,{root:true});
           Axios.post("/posts/create",{content}).then(({data})=>{
               commit("setNewPost", [data.post]);
               commit("stopgl_loader",null,{root:true})
           }).catch(()=>{
              commit("stopgl_loader",null,{root:true})
           })
       },
       updatePost({commit},payload){

        commit("rungl_loader",null,{root:true});
        commit("editor/closeEditor",null,{root:true});
         const {content,post,callback}=payload;
         let data={content,postid:post.id};
         Axios.post("/posts/update",data).then(({data})=>{
             callback(data.post);
             commit("stopgl_loader",null,{root:true})
         }).catch(err=>{
             console.log(err);
            commit("stopgl_loader",null,{root:true})
         })
       },
       sharePost({commit},payload){
            commit("rungl_loader",null,{root:true});
            commit("editor/closeEditor",null,{root:true});//todo
            const {content,post,callback}=payload;
            //if its a normal post
            let postid,username,owner
            if(post.type==='NORMAL'){
              postid=post.id;
              username = post.authorName;
              owner=post.author;
            }else{
                //if its already shared one,then use orginalpost data
                postid = post.originalPost.id;
                username = post.originalPost.authorName;
                owner = post.originalPost.author;
            }
            let data={content,postid,username,owner};
            Axios.post("/post/share",data).then(({data})=>{
                //call the callback
                //push the post to feed
                commit("setNewPost", [data.post]);
                callback(data.post);
                commit("stopgl_loader",null,{root:true})
            }).catch(err=>{
                commit("stopgl_loader",null,{root:true});
            })
       }
    },
    mutations:{
        setPosts(state, posts) {
                state.posts.push(...posts);
        },
        setNewPost(state, posts) {
            state.posts.unshift(...posts);
        },
        removeFromPosts(state, postId) {
            const index = state.posts.findIndex(post => post.id === postId);
            if (index != -1) {
                state.posts.splice(index, 1);
            }
        },
    },
}