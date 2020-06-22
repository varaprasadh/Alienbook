<template>
    <section>
        <div class="posts">
           <div class="posts-wrapper">
               <Post  v-for="(post,i) in posts" :key="i" :post="post"/>
           </div>
        </div>
   </section>
</template>

<script>
import Post from "./Post";
import {mapState} from 'vuex';
export default {
  name:"Feed",
  components:{
      Post
  },
  data:()=>({
    state:"sometging",
    _created:false
  }),
  computed:{
   ...mapState({
     posts:state=>state.posts
   })
  },
  mounted(){
     if(this._created==true){
      console.log("");
     }else{
       this.$store.dispatch('loadPosts');
        this._created=true; 
     }
  }
}
</script>

<style scoped>
.posts{
   display: flex;
   flex-direction: column;
   align-items: center;
 }
 @media screen and (max-width:600px){
    .posts{
      align-items: stretch;
    }
 }
 
</style>