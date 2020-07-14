<template>
  <section class="aliens">
     <div class="alien-list">
       <div class="alien-container" v-for="(alien,i) in aliens" :key="i">
          <AlienCard :alien="alien"/>
       </div>
        <div class="fallback card" v-if="aliens.length<=0 && !loading">
          <div>there is no aliens to follow!</div>
        </div>
        <BottomLoadBar v-if="loading"/>
     </div>
  </section>
</template>

<script>
import AlienCard from "../components/AlienCard";

import { mapState, mapMutations } from 'vuex'
import Axios from 'axios';
import BottomLoadBar from "../components/BottomLoadBar";

export default {
  name:"aliens",
  components:{
    AlienCard,BottomLoadBar
  },
  data:()=>({
      aliens:[],
      path:"",
      skip:0,
      loading:false,
      finished:false
  }),
  computed:{
      ...mapState(['state'])
  },
  mounted(){
    const route_path=this.$route.path;
    if(route_path.match(/^\/profile\/((?:[^/]+?))\/following(?:\/(?=$))?$/i)){
      this.path=`/users/following/${this.$route.params.username}`
    }else if(route_path.match(/^\/profile\/((?:[^/]+?))\/followers(?:\/(?=$))?$/i)){
      this.path=`/users/followers/${this.$route.params.username}`
    }else{
       this.path="/users/";
    }  
   window.onscroll=()=>{
     let isbottomVisible=document.documentElement.scrollTop+window.innerHeight===document.documentElement.offsetHeight;
     if(isbottomVisible){
       this.getAliens();
     }
   }
     this.getAliens();
   },
   destroyed(){
      window.removeEventListener('scroll',()=>{})
   },
  methods:{
      ...mapMutations(['runLoader','stopLoader']),
      getAliens(){
        if(this.finished || this.loading) return;
        this.loading=true;
         Axios.get(this.path,{
           params:{
             skip:this.skip
           }
         }).then(({data})=>{
           this.aliens.push(...data.users);
           this.skip=this.skip+20;
           this.finished=data.finished;
           this.loading=false;
         }).catch(err=>{
           console.log(err);
           this.loading=false;
         })
      },
  }
}
</script>

<style scoped>
.aliens{
    flex: 1;
}
.alien-list{
  max-width: 600px;
  margin: 10px auto;
}
 .fallback.card{
   text-align: center;
   padding: 1em;
   background: white;
 }

</style>