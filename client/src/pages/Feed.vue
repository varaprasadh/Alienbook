<template>
  <section class="feed">
    <div class="container">
      <div class="feed">
        <Post v-for="(post,i) in posts" :key="i" :post="post" v-on:delete="removeFromPosts($event)"/>
        <IntersectionObserver @intersect="loadFeed"/>
        <BottomLoadBar v-if="loading"/>
      </div>
      <div class="feed-fallback" v-if="posts.length==0">
        <div class="card">
          <div>follow few aliens to see their posts!</div>
          <div class="redirect-button" @click="$router.push('/aliens')">find Aliens</div>
        </div>
      </div>
    </div> 
  </section>
</template>

<script>

import Post from "../components/Post";
import BottomLoadBar from "../components/BottomLoadBar";
import IntersectionObserver from "../components/utils/IntersectionObserver";

import {createNamespacedHelpers} from 'vuex';
const {mapState,mapActions,mapMutations} = createNamespacedHelpers("feed");

const {mapActions:mapNotificationActions}= createNamespacedHelpers("notificationCentre");

export default {
    name:"feed",
    components:{
      Post,BottomLoadBar,
      IntersectionObserver
    },
    data(){
      return ({

      })
    },
    computed:{
      ...mapState({
        posts:state=>state.posts,
        loading:state=>state.loading
      })
    },
    created(){
      if(this.posts.length<=0){
        this.loadFeed();
        this.loadNotifications();
      }
    },
    methods:{
      ...mapActions(['loadFeed']),
      ...mapMutations(['removeFromPosts']),
      ...mapNotificationActions(['loadNotifications'])

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
.feed-fallback .card{
  padding: 1em 2em 0.5em 2em;
  background: white;
  box-shadow: 1px 1px 5px rgb(110, 109, 109);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 1.3em;
  border-radius: 3px;
  margin: 10px;
}
.feed-fallback .card .redirect-button{
  background: blue;
  color: white;
  padding: 0.2em 1.2em;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.redirect-button:hover{
  filter:brightness(0.7);
}

</style>