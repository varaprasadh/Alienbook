import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'


import LandingPage from "./components/pages/LandingPage";
import Auth from "./components/pages/Auth.vue";
import Error from "./components/pages/Error.vue";
import TagSelector from "./components/pages/TagSelector.vue";
import Home from "./components/pages/Home.vue";
import Profile from "./components/pages/Profile.vue";
import PostView from "./components/pages/PostView.vue";
import ResetPassword from "./components/pages/ResetPassword.vue";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)

Vue.component('font-awesome-icon', FontAwesomeIcon)


import store from "./store"

import axios from 'axios';

import UsernameView from "./components/pages/UserName.vue";
import saveToken from "./components/pages/saveToken.vue";


axios.defaults.baseURL = 'http://localhost:3000';

Vue.use(VueRouter);


axios.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer "+ (localStorage.getItem('token') || "");
  return config;
}, (error) => {
  return Promise.reject(error);
});
axios.interceptors.response.use((response) => {
   
    if (response.status === 401) {
         //redirect to login screen
    }
    return response;
}, (error) => {
  console.log(error.response.status);
    if(error.response.status===401){
        window.localStorage.clear();
        router.replace("/auth/switch/login");
    }
    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
});


const router = new VueRouter({
  mode:"history",
  routes:[
    {path:"/welcome",component:LandingPage,exact:true},
    {path:"/",component:Home,exact:true},
    {path:"/auth/switch/:type",component:Auth },
    {path:"/auth/tags",component:TagSelector},
    {path:"/resetpassword",component:ResetPassword},
    {path:"/signup/createuserame",component:UsernameView},
    {path:"/signin/saveToken",component:saveToken},
    {path:"/post/:id",component:PostView},
    
    {path:"/profile/:username?",component:Profile},
    {path:"*",component:Error},
  ],
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
