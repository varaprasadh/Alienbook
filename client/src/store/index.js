import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import axios from 'axios';

 const store = new Vuex.Store({
    state:{
      user:null,
      posts:[],
      feedSectionCreated:false,
      savedSectionCreated: false,
      saved:[],
      postBatch:0,
      appLoadingState: false,
      lastOpenedTab:"feed"
    },
    getters:{
     
    },
    actions:{
       loadPosts({commit,state}){
           if(state.feedSectionCreated==true){
               return;
           }
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
       loadUserInfo({commit}){
            commit('runLoader')
            axios.get("/user/info").then(({data}) => {
                if (data.success == true) {
                    commit('setUser',data.data);
                }
                 commit('stopLoader');
            }).catch(() => {
                //redirect to login page
                commit('stopLoader');
                //redirect to login
            })
       },
       loadSavedPosts({commit,state}){
            if (state.savedSectionCreated == true) {
                return;
            }
            commit('runLoader')
            axios.get("/saver/saved").then(({data})=>{
                if(data.success==true){
                    commit('loadSavedPosts',data.posts);
                }
               commit('stopLoader');
            }).catch(()=>{
                 commit('stopLoader');
            })
       }
    },
    mutations:{
      loadPosts(state,posts){
          state.posts.push(...posts);
          state.feedSectionCreated=true;
      },
       loadSavedPosts(state, posts) {
            state.saved = posts;
            state.savedSectionCreated=true;
        },
      runLoader(state){
          state.appLoadingState=true;
      },
      stopLoader(state){
          state.appLoadingState=false;
      },
      setUser(state,userdata){
          state.user=userdata
      },
      addPostToSaved(state,post){
          state.saved.unshift(post);
      },
      removeFromSaved(state,id){
          let index= state.saved.findIndex(post=>post.id===id);
          if(index!=-1){
              state.saved.splice(index,1);
          }
      },
        removeFromPosts(state,id){
            let index=state.posts.findIndex(post=>post.id===id);
            if(index!=-1){
                state.posts.splice(index,1);
            }
        },
        logout(state){
            state.user=null;
        }
    }
});

export default store;