<template>
         <div class="post-wrapper">
            <div class="card">
            <div class="meta">
                <div class="author">
                    <svg class="svg-icon" viewBox="0 0 20 20">
						<path fill="none" d="M19.629,9.655c-0.021-0.589-0.088-1.165-0.21-1.723h-3.907V7.244h1.378V6.555h-2.756V5.866h2.067V5.177h-0.689V4.488h-1.378V3.799h0.689V3.11h-1.378V2.421h0.689V1.731V1.294C12.88,0.697,11.482,0.353,10,0.353c-5.212,0-9.446,4.135-9.629,9.302H19.629z M6.555,2.421c1.522,0,2.756,1.234,2.756,2.756S8.077,7.933,6.555,7.933S3.799,6.699,3.799,5.177S5.033,2.421,6.555,2.421z"></path>
						<path fill="none" d="M12.067,18.958h-0.689v-0.689h2.067v-0.689h0.689V16.89h2.067v-0.689h0.689v-0.689h-1.378v-0.689h-2.067v-0.689h1.378v-0.689h2.756v-0.689h-1.378v-0.689h3.218c0.122-0.557,0.189-1.134,0.21-1.723H0.371c0.183,5.167,4.418,9.302,9.629,9.302c0.711,0,1.401-0.082,2.067-0.227V18.958z"></path>
					</svg>
                    <span>{{post.authorName}}</span>
                </div>
                <div class="options" @click="showOptions=!showOptions">
                    <svg class="svg-icon" viewBox="0 0 20 20">
                        <path fill="none" d="M3.936,7.979c-1.116,0-2.021,0.905-2.021,2.021s0.905,2.021,2.021,2.021S5.957,11.116,5.957,10
                            S5.052,7.979,3.936,7.979z M3.936,11.011c-0.558,0-1.011-0.452-1.011-1.011s0.453-1.011,1.011-1.011S4.946,9.441,4.946,10
                            S4.494,11.011,3.936,11.011z M16.064,7.979c-1.116,0-2.021,0.905-2.021,2.021s0.905,2.021,2.021,2.021s2.021-0.905,2.021-2.021
                            S17.181,7.979,16.064,7.979z M16.064,11.011c-0.559,0-1.011-0.452-1.011-1.011s0.452-1.011,1.011-1.011S17.075,9.441,17.075,10
                            S16.623,11.011,16.064,11.011z M10,7.979c-1.116,0-2.021,0.905-2.021,2.021S8.884,12.021,10,12.021s2.021-0.905,2.021-2.021
                            S11.116,7.979,10,7.979z M10,11.011c-0.558,0-1.011-0.452-1.011-1.011S9.442,8.989,10,8.989S11.011,9.441,11.011,10
                            S10.558,11.011,10,11.011z">
                        </path>
					</svg>
                    <div class="options-container" v-if="showOptions">
                        <div class="option" @click="savePost" v-if="userid!==post.author && savedPost!==true">Save</div>
                        <div class="option" @click="deletePost" v-if="userid==post.author">Delete</div>
                        <div class="option" @click="editPost" v-if="userid==post.author">Edit</div>
                        <div class="option" @click="deletePost" v-if="savedPost==true">remove</div>
                    </div>
                </div>
            </div>
            <div class="date">{{new Date(post.createdAt).toLocaleDateString()}}</div>
            <div class="content" v-on:click="openDetails">{{post.content}}</div>
            <div class="post-tags">
               <span :class="['post-tag']" v-for="(tag,i) in post.tags" :key="i">#{{tag}}</span>
            </div>
            <div class="post-stats">
                <div class="likes">{{post.likes}} Likes</div>
                <div class="comments">{{post.comments}} Comments</div>
            </div>
            <div class="last-comment-wrapper" v-if="showLastComment">
                <div class="last-comment">
                    <div class="commenter">you ></div>
                    <div class="i_am_last_comment">{{lastComment}}</div>
                </div>
            </div>
        </div>
        <div class="comment-box-wrapper" v-if="showCommentBox">
            <div class="comment-box">
                <div class="inputbox">
                    <input type="text"  @keyup.enter="sendComment" v-model="comment" class="comment">
                </div>
                <div :class="['icon', 'send',{spin:commentLoadingSpinner}]" @click="sendComment">
                    <svg class="svg-icon" viewBox="0 0 20 20">
						<path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
					</svg>
                </div>
            </div>
        </div>
        <div class="actions">
            <div :class="['action' ,'like',{active:liked}]" @click="like">Like </div>
            <div class="action comment"  @click="showCommentBox=true">Comment</div>
            <div class="action share" @click="share">Share</div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from 'vuex';

export default {
  name:"Post",
  props:["post",'nonClickable','savedPost'],
  data:()=>({
   liked:false,
   showOptions:false,
   showCommentBox:false,
   comment:"",
   commentLoadingSpinner:false,
   showLastComment:false,
   lastComment:"",
   saved:false,
   tagColors:['tomato','orang','black','blue','green']
}),
 computed:{
    ...mapState({
        userid:state=>state.user.id
    })
 },
  created(){
    this.commentLoadingSpinner=false;
    this.showLastComment=false;
    this.saved=this.savedPost;
    axios.get(`/liker/status/${this.post.id}`).then(({data})=>{
        if(data.success==true){
            this.liked=data.liked;
        }
    }).catch(()=>{
        //idont care currently;
    })
  },
  methods:{
      ...mapMutations(['runLoader','stopLoader','addPostToSaved','removeFromSaved','removeFromPosts']),
      like:function(){
          //if not liked  the post
         if(!this.liked){
           axios.post("/liker/like",{postId:this.post.id}).then(({data})=>{
               if(data.success==true){
                   this.liked=true;
                   this.post.likes++;
               }
           }).catch(()=>{
               //do nothing
           })
         }else{
           axios.post("/liker/dislike",{postId:this.post.id}).then(({data})=>{
               if(data.success==true){
                   this.liked=false;
                   this.post.likes--;
               }
           }).catch(()=>{
               //do nothing
           })
         }
      },
      sendComment(){
         if(this.comment.trim()==""){
             return;
         }
         this.commentLoadingSpinner=true;
         axios.post("/comments/create",{
             postId:this.post.id,
             text:this.comment
         }).then(({data})=>{
             if(data.success==true){
                 //add to the comment at post list
                this.lastComment=this.comment.trim();
                this.comment="";
                this.showCommentBox=false;
                this.showLastComment=true;
                this.post.comments++;
                this.$emit("commentAdded",data.comment);
             }
             this.commentLoadingSpinner=false;
         }).catch(()=>{
             //i dont care
             this.commentLoadingSpinner=false;
         })
      },
      share:function(){
          //copy link to clipboard and show message
      },
      openDetails(){
          if(this.nonClickable==true){
              return
          }
          this.$router.push(`/post/${this.post.id}`);
      },
      savePost(){
          //save the id into the user
          if(this.saved){
              return;
          }
          this.runLoader();
          axios.post("/saver/save",{postid:this.post.id}).then(({data})=>{
              if(data.success==true){
                  this.saved=true;
                 this.addPostToSaved(this.post);
              }
              this.stopLoader();
          }).catch(()=>{
             this.stopLoader();
          })
      },
      deletePost(){
          //two possible actions 
         if(this.savedPost==true){
             //delete from saved
             this.runLoader();
             axios.post("/saver/delete",{postid:this.post.id}).then(({data})=>{
                if(data.success==true){
                   this.removeFromSaved(this.post.id);
                }
                this.stopLoader();
             }).catch(()=>{
                 this.stopLoader();
             })
         }else{
             //deletes the actual post
            this.runLoader();
             axios.post("/posts/delete",{id:this.post.id}).then(({data})=>{
                 if(data.success==true){
                    this.removeFromPosts(this.post.id);
                    this.$emit('postDeleted');
                 }
                 this.stopLoader();
             }).catch(()=>{
                 //show some toast
                  this.stopLoader();
             })
         }
      },
      editPost(){
        
      }
  }
}

</script>

<style scoped>
.svg-icon path{
  fill: rgb(11, 34, 82);
}
.post-wrapper{
    margin: 1em 0em;
    max-width: 500px;
    flex: 1;
}
.svg-icon{
    width:1.8em;
    height: 1.8em;
}
 .card{
     padding: 1em 1.5em;
     background: white;
     box-shadow: 1px 1px 10px rgba(200, 197, 197, 0.541);
     flex: 1;
 }

 .meta{
     display: flex;
     justify-content: space-between;
 }
 .meta >div{
     font-weight: bold;
     font-size: 0.9em;
     color: rgb(9, 38, 66);
     margin: 5px 0px;
     display: flex;
     align-items: center;
 }
  .meta .author span{
    font-size:1.8em;
    padding: 0 0.2em;
  }
.date{
    font-size: 1em;
}
 .content{
     font-size: 1.2em;
     color: rgb(12, 11, 11);
     margin-top: 10px;
     cursor: pointer;
 }
 .actions{
     display: flex;
     margin: 0.5em 0em;
     box-shadow: 1px 1px 10px rgba(200, 197, 197, 0.541);
 }
 .action{
     flex: 1;
     display: flex;
     justify-content: center;
     padding: 1em;
     background: rgb(255, 255, 255);
     cursor: pointer;
     font-weight: bold;
     color: rgb(61, 59, 59);
 }
 .options{
     padding: 5px;
     transition: all 200ms linear;
     border-radius: 50%;
     cursor: pointer;
     position: relative;
 }
  .options:hover{
      background: rgb(233, 228, 228);
  }
 .options-container{
     position: absolute;
     top:100%;
     right: 100%;
     background: white;
     filter: drop-shadow(1px 1px 5px rgba(117, 115, 115, 0.472));
     transform-origin: top right;
 }

  .option{
   padding: 0.3em 1em;
   background: rgb(255, 250, 250);
  }
 .option:hover{
  background: rgb(235, 230, 230);
 }
 .post-stats{
     display: flex;
     justify-content: space-between;
     padding: .2em;
     margin-top: 10px;
     font-weight: bold;
 }
 .post-tags{
     margin: 0.5em 0em;
     display: flex;
     flex-wrap: wrap;
 }
 .post-tags .post-tag{
     padding: 2px 4px;
     font-weight: bold;
     color: blue;
 }

 .last-comment{
     display: flex;
     align-items: center;
     border: 1px solid rgb(231, 231, 231);
     padding: 10px 0px;
 }
 .commenter{
     font-weight: bold;
 }
 .i_am_last_comment{
     margin: 0 1em;
 }
 .comment-box{
    display: flex;
    align-items: center;
    background: white;
    margin: 5px 0px;
    padding: 0.5em;
    filter: drop-shadow(1px 1px 10px rgb(216, 213, 213));
 }
 .comment-box .inputbox{
   flex: 1;
 }
 .comment-box .inputbox input{
     width: 100%;
     background: none;
     border: none;
     outline: none;
     padding: 0em 0.5em;
     font-size:1.2em;
 }
 .comment-box .icon{
     cursor: pointer;
     transition:all 0.2s linear;
 }
 .comment-box .icon.spin{
     animation: rotate 1s linear;
 }
 @keyframes rotate {
     to{
         transform: rotate(360deg);
     }
 }
 .comment-box .icon:hover{
     transform: rotate(45deg);
 }
 .action:hover{
     /* color: white; */
     transition: all 300ms cubic-bezier(0.895, 0.03, 0.685, 0.22);
 }
 .action.like:hover, .action.like.active{
     background: rgb(137, 137, 228);
     color: white;
 }

  @media screen and (min-width:600px){
    .post-wrapper{
      width: 500px;
    }
 }
</style>