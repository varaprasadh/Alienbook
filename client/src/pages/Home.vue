<template>
  <section class="home">
    <AppNavBar/>
    <router-view></router-view>
  </section>
</template>

<script>

import AppNavBar from "../components/AppNavBar";
import Axios from 'axios';
import { mapMutations } from 'vuex';
export default {
   name:"Home",
   components:{
    AppNavBar
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
}

</style>