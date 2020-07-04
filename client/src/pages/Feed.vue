<template>
  <section class="feed">
    <div class="container">
      <div class="feed">
        <Post v-for="(post,i) in feed" :key="i" :post="post" v-on:delete="removeFromFeed($event)"/>
        <BottomLoadBar v-if="loading"/>
      </div>
    </div> 
  </section>
</template>

<script>
// import userAvatar from "../components/svg/user_avatar";
import Axios from "axios";
import {mapMutations, mapState} from 'vuex';
import Post from "../components/Post";
import BottomLoadBar from "../components/BottomLoadBar";

export default {
    name:"feed",
    components:{
      Post,BottomLoadBar
    },
    data(){
      return ({
         completed:false,
         loading:false,
         skip:0,
      })
    },
    computed:{
      ...mapState(['feed'])
    },
    created(){
      if(this.feed.length<=0){
        this.loadFeed();
      }
    },
    mounted(){
      window.onscroll=()=>{
        let isbottomVisible=document.documentElement.scrollTop+window.innerHeight===document.documentElement.offsetHeight;
        if(isbottomVisible){
          this.loadFeed();
        }
      }
    },
    methods:{
      ...mapMutations(['setFeedPosts','rungl_loader','stopgl_loader','openEditor','removeFromFeed']),
      loadFeed(){
        if(this.loading || this.completed){
          return;
        }
        this.loading=true;
        Axios.get("/posts",{params:{skip:this.skip}}).then(({data})=>{
         this.setFeedPosts(data.posts);
         this.completed=data.completed;
         this.skip+=20;
         this.loading=false;
        }).catch(()=>{
          this.loading=false;
        })
      },
      
    }
}
</script>

<style scoped>
.container{
   max-width: 600px;
   margin:1rem auto;
 }

 .create-post.fab{
  position: fixed;
  bottom: 10px;
  right: 10px;
}
.create-post{
  z-index: 99;
}
 .create-post-skeleton{
  padding:20px;
  cursor: pointer;
  background: rgb(10, 10, 53);
  color: white;
  fill: white;
  border-radius: 50%;
   filter: drop-shadow(2px 2px 2px rgb(27, 27, 27));
 }
.create-post-skeleton .icon svg{
  width: 2rem;
}

</style>