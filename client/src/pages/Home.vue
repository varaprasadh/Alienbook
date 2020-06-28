<template>
  <section class="home">
    <div class="app-nav-wrappe">
      <AppNavBar/>
      <GLHLoader/>
    </div>
    <div class="utils">
       <PostEditor/>
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
    ...mapMutations(['setUser','runLoader','stopLoader'])
   },
   mounted(){
     Axios.get("/users/profile").then(({data})=>{
       this.setUser(data.data);
     }).catch(err=>{
        console.log(err);
        localStorage.clear();
        this.$router.replace("/");
    })
   }    
}
</script>

<style scoped>
.home{
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* position: relative; */
}
.app-nav-wrappe{
  position: sticky;
  top:0px;
}
.utils{
  position: absolute;
}
</style>