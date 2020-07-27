/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import feedModule from "./feed";
import notificationsModule from "./notifications";




const appState = {
    appLoadingState: false,
    gl_h_loader: false,
   
}


import feedState from "./modules/feed";
import notificationsState from "./modules/notifications";
import userState from "./modules/user";
import editor from "./modules/editor";



 const store = new Vuex.Store({
     modules:{
        feed:feedState,
        notificationCentre:notificationsState,
        user:userState,
        editor:editor
     },
    state: appState,
    getters:{

    },
    actions:{


    },
    mutations:{
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