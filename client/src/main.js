import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import vClickOutside from 'v-click-outside'


import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth.vue";
import Home from "./pages/Home.vue";


import store from "./store"

import axios from 'axios';

import UsernameView from "./pages/UserName.vue";
import saveToken from "./pages/saveToken.vue";

import Feed from "./pages/Feed.vue";
import PostView from "./pages/PostView.vue";


import Profile from "./pages/Profile.vue";
import Settings from "./pages/Settings.vue";
import FindAliens from "./pages/FindAliens.vue";
import Notifications from "./pages/Notifications.vue";


axios.defaults.baseURL = 'http://localhost:3000';

Vue.use(VueRouter);


axios.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer "+ (localStorage.getItem('token') || "");
  return config;
}, (error) => {
  return Promise.reject(error);
});
axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
  console.log(error.response.status);
    if(error.response.status===401){
        window.localStorage.clear();
        router.replace("/login");
    }
    if(error.response.status===404){
        router.replace("/error");
    }
    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
});


const router = new VueRouter({
  mode:"history",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return false;
    }
  },
  routes:[
    {path:"/welcome",component:LandingPage,exact:true},
    {path:"/login",component:Auth},
    {path:"/signup/createuserame",component:UsernameView},
    {path:"/signin/saveToken",component:saveToken},
    {path:"/",
     component:Home,
     exact:true,
     children:[
       {
        path:"/",
        name:"feed",
        component: Feed
      },
       {
        path:"aliens",
        name:"aliens",
        component: FindAliens
      },
       {
        path: "profile/:username/followers",
        name:"followers",
        component: FindAliens
      },
       {
        path: "notifications",
        name: "notifications",
        component: Notifications
      },
       {
        path: "profile/:username/following",
        name:"following",
        component: FindAliens
      },
      {
        path: "/settings",
        name: "settings",
        component: Settings
      },
    ]
    },
    {
      path: "/profile/:username?",
      name: "profile",
      component: Profile,
      props: true
    },
    {
      path: "/policy",
      name: "policy",
      component: () => import( /* webpackChunkName: "policy" */ "./pages/Policy.vue"),
    },
    {
      path: "/post/:postid",
      name: "postview",
      component: PostView,
      props: true
    },
    {
      path: "*",
      component: () => import( /* webpackChunkName: "error" */ "./pages/Error.vue")
    },
  ],
})
Vue.use(vClickOutside);


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
