<template>
  <section class="home">
    <div class="app-nav-wrapper">
      <AppNavBar/>
      <GLHLoader/>
    </div>
    <div class="utils">
      <transition name="fade" appear>
        <PostEditor/>
      </transition>
    </div>
    <router-view></router-view>
  </section>
</template>

<script>

import AppNavBar from "../components/AppNavBar";
import GLHLoader from "../components/GLHLoader";
import PostEditor from "../components/PostEditor";


import Axios from 'axios';
import { mapMutations } from 'vuex';
export default {
   name:"Home",
   components:{
    AppNavBar,
    GLHLoader,
    PostEditor
   },
   methods:{
    ...mapMutations(['setuser','runLoader','stopLoader'])
   },
   mounted(){
     Axios.get("/users/profile").then(({data})=>{
       this.setuser(data.data);
     }).catch(err=>{
        console.log(err);
        localStorage.clear();
        this.$router.replace("/login");
    })
   }    
}
</script>

<style scoped>
.home{
  min-height: 100%;
  display: flex;
  flex-direction: column;
  /* position: relative; */
}
.app-nav-wrapper{
  position: sticky;
  top:0px;
  z-index: 99;
}
.utils{
  position: absolute;
}
</style>