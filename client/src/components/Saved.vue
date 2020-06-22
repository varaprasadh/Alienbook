<template>
  <section>
    <div class="posts">
       <div class="posts-wrapper">
          <Post v-for="(post,i) in savedPosts" :key="i" :post="post" :savedPost="true"/>
       </div>
    </div>
  </section>
</template>

<script>
import Post from "./Post"
import { mapState, mapActions } from 'vuex'

export default {
    name:"Profile",
    components:{
      Post
    },
    computed:{
      ...mapState({
        savedPosts:state=>state.saved
      })
    },
    methods:{
      ...mapActions(['loadSavedPosts'])
    },
    created(){
      this.loadSavedPosts();
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