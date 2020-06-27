import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import axios from 'axios';

 const store = new Vuex.Store({
    state:{
      user:null,
      posts:[],
      appLoadingState: false,
      gl_h_loader:false,
    },
    getters:{
     
    },
    actions:{
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
    },
    mutations:{
      loadPosts(state,posts){
          state.posts.push(...posts);
      },
      runLoader(state){
          state.appLoadingState=true;
      },
      setUser(state,user){
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
        }
    }
});

export default store;