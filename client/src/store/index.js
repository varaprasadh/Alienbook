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
const appState = {
    user: null,
    feed: [],
    appLoadingState: false,
    gl_h_loader: false,
    editorOpen: false,
    editorAuxData: editorInitialState,
    notifications: []
}


import axios from 'axios';
import Axios from 'axios';

 const store = new Vuex.Store({
    state: appState,
    getters:{
     getUnreadNotifCount(state,){
         return state.notifications.reduce((sum,notif)=>sum+(notif.read==false?1:0),0)
     }
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

       publishPost({commit},payload){
           console.log(payload);
           const {content} =payload;
           if(content.trim()===""){
               return;
           }
           commit("rungl_loader");
           commit("closeEditor");
           Axios.post("/posts/create",{content}).then(({data})=>{
               commit("setNewFeed",[data.post]);
               commit("stopgl_loader")
           }).catch(()=>{
              commit("stopgl_loader")
           })
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
                commit("setNewFeed", [data.post]);
                callback(data.post);
                commit("stopgl_loader")
            }).catch(err=>{
                commit("stopgl_loader")
            })
       }
    },
    mutations:{
        setFeedPosts(state, posts) {
            state.feed.push(...posts);
        },
        setNewFeed(state,posts){
            state.feed.unshift(...posts);
        },
        removeFromFeed(state,postId){            
           const index=state.feed.findIndex(post=>post.id===postId);
           if(index!=-1){
              state.feed.splice(index,1);
           }
        },
        setNotifications(state,notifications){
            state.notifications.push(...notifications)
        },
        removeNotification(state,id){
          let index=state.notifications.findIndex(n=>n.notification_id===id);
          if(index!=-1){
              state.notifications.splice(index,1);
          }
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
        logout(state){
            state=appState
        },
        openEditor(state, data={}) {
            let {post={content:" "},callback=()=>{},type="NORMAL",content=""}=data;
            console.log("debug",type);
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