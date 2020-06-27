<template>
  <section class="profile">
    <div class="section-title">Profile</div>
    <div class="container user-card">
      <ProfileCard :user='user'/>
    </div>
    <div class="container user-posts">
      <Post v-on:delete="deletePost" v-for="(post,i) in posts" :key="i" :post="post"/>
    </div>
  </section>
</template>

<script>
import ProfileCard from "../components/ProfileCard";
import Post from "../components/Post";

import { mapMutations } from 'vuex'
import Axios from 'axios'
export default {
  name:"profile",
  components:{
    ProfileCard,
    Post
  },
  data:()=>({
    user:{},
    posts:[]
  }),
  methods:{
    ...mapMutations(['runLoader','stopLoader']),
    deletePost(id){
       let index=this.posts.find(post=>post.id===id);
       if(index!=-1){
         this.posts.splice(index,1);
       }
    }
  },
  beforeRouteUpdate(to,from,next){
    console.log(to,from);
    if(to.path!==from.path){
        let username=to.params.username;
        let promise1=Axios.get(`/users/profile/${username}`).then(({data})=>{
          this.user=data.data;
        }).catch(err=>{
          console.log(err);
        });
        let promise2=Axios.get(`/posts/${username}`).then(({data})=>{
          this.posts=data.posts;
        }).catch(err=>{
          console.log(err);
        })
        console.log(promise1,promise2);
        next();
    }else{
      next();
    }
  },

  mounted(){
       let username=this.$route.params.username;
        Axios.get(`/users/profile/${username}`).then(({data})=>{
          this.user=data.data;
        }).catch(err=>{console.log(err);});
        Axios.get(`/posts/${username}`).then(({data})=>{
          this.posts.push(...data.posts);
        }).catch(err=>{console.log(err) })
  }
}
/*


*/
</script>

<style scoped>
  .profile{
    flex: 1;
  }
 .section-title{
   margin: 1rem;
   font-weight: bold;
   font-size: 2rem;
 }
.container{
   /* background: rgb(255, 255, 255); */
   max-width: 600px;
   margin:1rem auto;
 }
 
</style>