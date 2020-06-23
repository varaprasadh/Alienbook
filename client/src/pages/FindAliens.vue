<template>
  <section class="aliens">
     <div class="section-heading">Aliens</div>
     <div class="alien-list">
       <div class="alien-container" v-for="(alien,i) in aliens" :key="i">
             <AlienCard :alien="alien"/>
       </div>
       <div class="loading" v-if="loading">
           <div class="loading-bar">
              <div class="loading-line"></div>
           </div>
       </div>
     </div>
  </section>
</template>

<script>
import AlienCard from "../components/AlienCard";

import { mapState, mapMutations } from 'vuex'
import Axios from 'axios';

export default {
  name:"aliens",
  components:{
    AlienCard
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
    background: rgb(231, 228, 228);
    flex: 1;
}
.section-heading{
  font-weight: bold;
  font-size: 2rem;
  margin: 1rem;
}
.alien-list{
  max-width: 600px;
  margin: 10px auto;
}

.loading{
  text-align: center;
  padding: 10px;
  background: white;
}

.loading-bar{
  width: 100%;
  height: 5px;
  overflow: hidden;
  position: relative;
}
.loading-line{
  position: absolute;
  animation: load 1s cubic-bezier(0.77, 0, 0.175, 1) infinite alternate-reverse;
  background: rgb(179, 175, 175);
  height: 100%;
}

@keyframes load{
  from{
     left:0%;
     width:20%;
  }
  to{
    left:100%;
    width: 100%;
  }
}
</style>