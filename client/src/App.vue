<template>
  <div id="app">
    <app-loader v-if="appLoadingState"/>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState } from 'vuex';
import AppLoader from "./components/AppLoader.vue";
// import socketio from "socket.io-client";

import {createNamespacedHelpers} from 'vuex';
const {mapActions:mapUserActions}= createNamespacedHelpers("user");
export default {
  name: 'App',
  components: {
    AppLoader
  },
  computed:{
    ...mapState(['appLoadingState'])
  },
  methods:{
      ...mapUserActions(['loadUserInfo']),
  },
  created(){
    // this.loadUserInfo();
  },
  mounted(){
    // const socket=socketio("http://localhost:3001/");

    // socket.on('connect',()=>{
    //   //send userid to make a room
      
    // })
  }
}
</script>

<style>
 body,html{
   padding: 0px;
   margin: 0px;
   font-family:sans-serif;
   background: rgb(237, 239, 241);
   -webkit-tap-highlight-color: transparent;
   
 }

 .svg-icon {
  width: 1em;
  height: 1em;
}
.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: #ffffff;
}
.svg-icon circle {
  stroke: #ffffff;
  stroke-width: 1;
}
.tags{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.tag{
    color: white;
    padding: 0.2em 0.5em;
    font-size: 1em;
    margin: 5px;
    border-radius:1px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.red{
    background: rgb(194, 46, 70);
}
.orange{
  background: rgb(247, 141, 21);
}
.blue{
    background: blue;
}
.gray{
  background: gray;
}
.cyan{
  background: rgb(4, 100, 100);
}
.reaction-text.LIKE{
   color: rgb(36, 84, 214)!important;
}
.reaction-text.LOVE{
  color: red!important;
}
.reaction-text.CARE {
  color: red!important;
}
.reaction-text.HAHA{
    color:  rgb(226, 105, 49)!important;
}
.reaction-text.ANGRY{
  color: rgb(209, 114, 130)!important;
}
.reaction-text.WOW{
  color: rgb(226, 105, 49)!important;
}
@media screen and (max-width:600px) {
 body{
   padding-bottom: 80px;
 }
}
</style>