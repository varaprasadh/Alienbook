<template>
  <section class="profile">
    <PlainHeader title="Profile"/>
    <div class="container user-card">
      <ProfileCard v-if="user" :user='user'/>
      <div v-else><LoadBar/></div>
    </div>
    <div class="container user-posts">
      <Post v-on:share="onShare($event)" v-on:delete="deletePost" v-for="(post,i) in posts" :key="i" :post="post"/>
      <div class="fallback card" v-if="posts.length<=0 && !postsLoading">
        <div class="text">no posts!</div>
      </div>
    </div>
  </section>
</template>

<script>
import ProfileCard from "../components/ProfileCard";
import Post from "../components/Post";
import LoadBar from "../components/BottomLoadBar"
import { mapMutations } from 'vuex';
import PlainHeader from "../components/PlainHeader";

import Axios from 'axios'
export default {
  name:"profile",
  components:{
    ProfileCard,
    Post,
    LoadBar,
    PlainHeader
  },
  data:()=>({
    user:null,
    posts:[],
    userLoading:false,
    postsLoading:false,
  }),

  methods:{
    ...mapMutations(['runLoader','stopLoader']),
    deletePost(id){
       let index=this.posts.findIndex(post=>post.id===id);
       if(index!=-1){
         this.posts.splice(index,1);
       }
    },
     onShare(post){
        this.posts.unshift(post);
    }
  },


  created(){
       let username=this.$route.params.username;
       this.userLoading=true;
       this.postsLoading=true;
        Axios.get(`/users/profile/${username}`).then(({data})=>{
          this.user=data.data;
        }).catch(err=>{console.log(err);}).finally(()=>this.userLoading=false);
        Axios.get(`/posts/${username}`).then(({data})=>{
          this.posts.push(...data.posts);
        }).catch(err=>{console.log(err) }).finally(()=>this.postsLoading=false);
  },

}

</script>

<style scoped>
  .profile{
    flex: 1;
  }
.container{
   max-width: 600px;
   margin:1rem auto;
 }
 .fallback.card{
   text-align: center;
   padding: 1em;
   background: white;
 }
</style>