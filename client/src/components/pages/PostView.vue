<template>
  <section>
        <NavWithBack/>
        <div class="container">
           <div class="wrap">
             <Post :post="post" v-on:commentAdded="commentAdded" v-on:postDeleted="goBack" v-if="post" :nonClickable="true"/>
             <div class="section-title">comments</div>
             <div class="comments">
               <div class="comment" v-for="(comment,i) in comments" :key="i">
                  <div class="author_name">{{comment.author_name}} : </div>
                  <div class="text">{{comment.comment}}</div>
                  <div class="action" v-if="comment.author_id==userid" @click="deleteComment(comment.comment_id)">
                         delete
                  </div>
               </div>
             </div>
           </div>
        </div>
  </section>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';
import Post from "../Post";
import NavWithBack from "../NavWithBack"

export default {
  name:"PostView",
  components:{
        Post,NavWithBack
  },
  data:()=>({
    post:null,
    postId:"",
    comments:[]
  }),
  computed:{
   ...mapState({
     userid:state=>state.user.id
   })
  },
  methods:{
    ...mapMutations(['runLoader','stopLoader']),
    goBack(){
      this.$router.go(-1);
    },
    deleteComment(comment_id){
       axios.post("/comments/delete",{postId:this.post.id,commentId:comment_id})
       .then(({data})=>{
           if(data.success==true){
             this.comments=this.comments.filter(comment=>comment.comment_id!=comment_id);
             this.post.comments--;
           }
       }).catch(()=>{
           //handle 
       })
    },
    commentAdded(comment){
      let newComment={
        ...comment,
        author_id:comment.user_id,
        comment:comment.text,
        author_name:"you"
      }
       this.comments.unshift(newComment);
    }
   
  },
  mounted(){
    this.postId=this.$route.params.id;
    this.runLoader();
     axios.get(`/posts/post/${this.postId}`).then(({data})=>{
       if(data.success==true){
           this.post=data.post;
       }
       this.stopLoader();
     }).catch(()=>{
        this.stopLoader();
        this.$router.replace("/error");
    });
    axios.get(`/comments/${this.postId}`).then(({data})=>{
      if(data.success){
        this.comments=data.comments;
        console.log(this.comments);
      }
    }).catch(()=>{
       //todo
    })
   
  }

}
</script>

<style scoped>
.container{
  display: flex;
  justify-content: center;
}

 .comment{
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 10px;
   border: 1px solid rgb(211, 208, 208);
 }
 .comment .text{
   flex: 1;
   margin:0 10px;
 }
 .section-title{
   font-weight: bold;
   font-size: 1.3em;
   margin: 1em 0px  0.5em 0px;
 }
 .author_name{
   font-weight: bold;
 }
 .action{
   /* display: none; */
   color: tomato;
 }
 .comment:hover .action{
   cursor: pointer;
   display: block;
 }

</style>