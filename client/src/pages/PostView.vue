<template>
  <section class="post-view-wrapper">
    <PlainHeader/>
    <div class="container">
       <Post v-if="post" v-on:delete="onDeletePost" :post="post" v-on:comment="addToComments($event)" :preventOnComment="true"/>
       <div class="comments" v-if="post">
         <div class="label">comments</div>
         <Comment v-for="(cmt,i) in comments" v-on:commentdelete="deleteComment($event)" :key="i" :comment="cmt"/>
         <div class="fallback card" v-if="comments.length<=0">
           <div>be the first to comment</div>
         </div>
       </div>
    </div>
  </section>
</template>

<script>
import Post from "../components/Post";
import Comment from "../components/Comment";
import PlainHeader from "../components/PlainHeader";
import Axios from 'axios';
import { mapMutations } from 'vuex';

export default {
  name:"post-view",
  components:{
    Post,Comment,PlainHeader
  },
  data(){
    return ({
       post:null,
       comments:[],
       commentSkipOffest:0,
       completed:false,
       loading:false
    })
  },
  mounted(){
    window.onscroll=()=>{
      let isbottomVisible=document.documentElement.scrollTop+window.innerHeight===document.documentElement.offsetHeight;
      if(isbottomVisible){
         this.loadComments();
      }
    }
    this.runLoader();
    this.loadPost(this.$route.params.postid).then(post=>{
      this.post=post;
      this.loadComments();
    }).catch(err=>{
      console.log(err);
    }).finally(()=>{
      this.stopLoader();
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
    ...mapMutations(['runLoader','stopLoader']),
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
        this.loading=true;
        Axios.get(`/post/comments/${this.post.id}`,{params:{skip:this.commentSkipOffest}}).then(({data})=>{
            this.comments.push(...data.comments);
            this.completed=data.completed;
            this.commentSkipOffest+=20;
        }).catch(console.log).finally(()=>{
          this.loading=false;
        })
      },
      addToComments(comment){
         this.comments.unshift(comment);
     },
     deleteComment(id){
       Axios.post("/post/uncomment",{postId:this.post.id,commentId:id}).then(()=>{
         let index=this.comments.findIndex(c=>c.comment_id===id);
         if(index!=-1){
           this.comments.splice(index,1);
         }
       }).catch(()=>{
         //
       })
     },
      onDeletePost(){
       window.history.length > 2?this.$router.go(-1):this.$router.push("/");
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
  .fallback.card{
   text-align: center;
   padding: 1em;
   background: white;
 }
 
</style>