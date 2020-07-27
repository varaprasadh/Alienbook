/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import feedModule from "./feed";
import notificationsModule from "./notifications";




const appState = {
<<<<<<< HEAD
    appLoadingState: false,
    gl_h_loader: false,
   
=======
    user: null,
    appLoadingState: false,
    gl_h_loader: false,
    editorOpen: false,
    editorAuxData: editorInitialState,
>>>>>>> 9ad19e7217d632cbbef896d72ebb7d6cc0c3bb0f
}


import feedState from "./modules/feed";
import notificationsState from "./modules/notifications";
import userState from "./modules/user";
import editor from "./modules/editor";



 const store = new Vuex.Store({
     modules:{
<<<<<<< HEAD
        feed:feedState,
        notificationCentre:notificationsState,
        user:userState,
        editor:editor
     },
    state: appState,
    getters:{

=======
         feed:feedModule,
         notifications: notificationsModule,
     },
    state: appState,
    getters:{
>>>>>>> 9ad19e7217d632cbbef896d72ebb7d6cc0c3bb0f
    },
    actions:{

<<<<<<< HEAD
=======
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
>>>>>>> 9ad19e7217d632cbbef896d72ebb7d6cc0c3bb0f

    },
    mutations:{
<<<<<<< HEAD
=======


>>>>>>> 9ad19e7217d632cbbef896d72ebb7d6cc0c3bb0f
        runLoader(state){
            state.appLoadingState=true;
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
        }
    },
});

export default store;