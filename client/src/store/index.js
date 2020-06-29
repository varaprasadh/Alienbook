/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


const editorInitialState = {
    post: {},
    callback: null,
    type: "NORMAL",
    content:" "
}


import axios from 'axios';
import Axios from 'axios';

 const store = new Vuex.Store({
    state:{
      user:null,
      posts:[],
      appLoadingState: false,
      gl_h_loader:false,
      editorOpen:false,
      editorAuxData: editorInitialState
    },
    getters:{
     
    },
    actions:{
        loadUserInfo({commit}){
            commit('runLoader')
            axios.get("/users/profile").then(({data})=>{
                commit('setuser',data.data);
                 commit('stopLoader');
            }).catch(err=>{
                commit('stopLoader');
                commit('logout');
            })
        },
       loadPosts({commit}){
          commit('runLoader')
          axios.get("/posts/").then(({data})=>{
                if(data.success==true){
                    commit('loadPosts',data.posts)
                }
                commit('stopLoader');
            }).catch(()=>{
                commit('stopLoader');
            })
       },
       publishPost({commit},payload){
           console.log(payload);
       },
       updatePost({commit},payload){
        //  const {conten}
         commit("rungl_loader");
         commit("closeEditor");
         const {content,post,callback}=payload;
         let data={content,postid:post.id};
         Axios.post("/posts/update",data).then(({data})=>{
             callback(data.post);
             commit("stopgl_loader")
         }).catch(err=>{
             console.log(err);
            commit("stopgl_loader")
         })
       },
       sharePost({commit},payload){
            commit("rungl_loader");
            commit("closeEditor");
            const {content,post,callback}=payload;
            //if its a normal post
            let postid,username
            if(post.type==='NORMAL'){
              postid=post.id,
              username = post.authorName
            }else{
                //if its already shared one,then use orginalpost data
                postid = post.originalPost.id,
                username = post.originalPost.authorName
            }
            let data={content,postid,username};
            Axios.post("/post/share",data).then(({data})=>{
                //call the callback
                //push the post to feed
                callback(data.post);
                commit("stopgl_loader")
            }).catch(err=>{
                commit("stopgl_loader")
            })
       }
    },
    mutations:{
        loadPosts(state,posts){
            state.posts.push(...posts);
        },
        runLoader(state){
            state.appLoadingState=true;
        },
        setuser(state, user) {
            state.user=user;
        },
        stopLoader(state){
            state.appLoadingState=false;
        },
        rungl_loader(state){
            state.gl_h_loader=true;
        },
        stopgl_loader(state){
        state.gl_h_loader = false;
        },
        removeFromPosts(state,id){
            let index=state.posts.findIndex(post=>post.id===id);
            if(index!=-1){
                state.posts.splice(index,1);
            }
        },
        logout(state){
            state.user=null;
        },
        openEditor(state, data) {
            let {post={content:" "},callback=()=>{},type="NORMAL",content=""}=data;
            if(type==='EDIT'){
                content=post.content;
            }
            state.editorAuxData={post,callback,type,content}
            state.editorOpen =true;
        },
        closeEditor(state){
            state.editorAuxData = editorInitialState;
            state.editorOpen=false;
        },
    },
});

export default store;