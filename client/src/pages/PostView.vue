<template>
  <section class="post-view-wrapper">
    <div class="container">
       <Post v-if="post" :post="post" v-on:comment="addToComments($event)" :preventOnComment="true"/>
       <div class="comments">
         <div class="label">comments</div>
         <Comment v-for="(cmt,i) in comments" :key="i" :comment="cmt"/>
       </div>
    </div>
  </section>
</template>

<script>
import Post from "../components/Post";
import Comment from "../components/Comment";

import Axios from 'axios';

export default {
  name:"post-view",
  components:{
    Post,Comment
  },
  data(){
    return ({
       post:null,
       comments:[],
       commentSkipOffest:0,
       completed:false
    })
  },
  mounted(){
    window.onscroll=()=>{
      let isbottomVisible=document.documentElement.scrollTop+window.innerHeight===document.documentElement.offsetHeight;
      if(isbottomVisible){
         this.loadComments();
      }
    }


    this.loadPost(this.$route.params.postid).then(post=>{
      this.post=post;
      this.loadComments();
    }).catch(err=>{
      console.log(err);
    })
  },
  beforeRouteUpdate(to,from,next){
    if(to.path!==from.path){
      let postid=to.params.postid;
      this.loadPost(postid).then((post)=>{
        this.post=post;
        next();
      }).catch(err=>{
        console.log(err);
        next(false);
      })
      next();
    }else{
      next();
    }
  },
  methods:{
    loadPost(id){
      return new Promise((resolve,reject)=>{
        Axios.get(`/posts/post/${id}`).then(({data})=>{
          resolve(data.post);
        }).catch(err=>{
          reject(err);
        })
      })
    },
      loadComments(){
          if(this.loading || this.completed){
              return;
          }
        Axios.get(`/post/comments/${this.post.id}`,{params:{skip:this.commentSkipOffest}}).then(({data})=>{
            this.comments.push(...data.comments);
            this.completed=data.completed;
            this.commentSkipOffest+=20;
        }).catch(console.log);
      },
      addToComments(comment){
         this.comments.unshift(comment);
     }
  },

}

</script>

<style scoped>
.container{
   max-width: 600px;
   margin:1rem auto;
 }
 .label{
     font-weight: bold;
     margin: 10px;
 }
</style>