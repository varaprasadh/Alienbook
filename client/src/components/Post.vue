<template>
    <div class="post-wrapper">
        <div class="card">
            <div class="meta">
                <div class="meta-post-info">
                    <div class="author-img">
                        <avatarSVG/>
                    </div>
                    <div class="info" @click.stop="$router.push({name:'postview',params:{postid:post.id}})">
                        <div class="post-head-info" >
                            <span class="author-name" @click.stop="$router.push({name:'profile',params:{username:post.authorName}})">{{post.authorName}}</span>
                            <span class="shared-meta" v-if="post.type==='SHARE'">
                                shared <span class="author-name">{{post.ref_author_username}}'s post</span>
                            </span>
                            <span v-else> shared a post</span>
                        </div>
                        <div class="pub-date">{{new Date(post.createdAt).toLocaleDateString()}}</div>
                    </div>
                </div>
                <div class="options" @click="showOptions=!showOptions" v-click-outside="()=>showOptions=false">
                    <div class="option-icon">
                        <menuOptionsIcon/>
                    </div>
                    <div class="options-container"  v-if="showOptions">
                        <div class="option" @click="deletePost" v-if="userid===post.author">Delete</div>
                        <div class="option" @click="edit" v-if="userid===post.author">Edit</div>
                    </div>
                </div>
            </div>
            <div class="content">
                <PostTextContent v-if="post.content && post.content.trim()!=''" :content="post.content"/>
                <RefPost v-if="post.type==='SHARE'" v-on:openPost="$router.push('/')" :post="post.originalPost" :refAuthorName="post.ref_author_username"/>
            </div>
            <div class="post-stats">
                <div class="likes">{{post.likes}} Likes</div>
                <div class="comments">{{post.comments}} Comments</div>
            </div>
            
            <div class="last-comment-wrapper" v-if="comments.length>0">
                <div>
                    <div class="devider"></div>
                    <div class="label">Comments</div>
                </div>
               <div class="comments">
                   <Comment v-for="(comment,i) in comments" :key="i" :comment="comment"/>
               </div>
            </div>
        </div>
        <div class="share-options-wrapper">
           
        </div>
        <div class="comment-box-wrapper" v-if="showCommentBox" v-click-outside="()=>showCommentBox=false">
            <div class="comment-box">
                <div class="inputbox">
                    <input type="text" placeholder="start typing..." @keyup.enter="sendComment" v-model="comment" class="comment">
                </div>
                <div :class="['icon', 'send',{spin:commentLoadingSpinner}]" @click="sendComment">
                    <svg class="svg-icon" viewBox="0 0 20 20">
						<path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
					</svg>
                </div>
            </div>
        </div>
        <div class="actions">
            <div :class="['action' ,'like',{active:post.liked}]" @click="like">Like </div>
            <div class="action comment"  @click="showCommentBox=true">Comment</div>
            <div class="action share" @click="share">Share</div>
        </div>
    </div>
</template>

<script>

import axios from "axios";
import { mapState, mapMutations, } from 'vuex';
import avatarSVG from "./svg/user_avatar";
import menuOptionsIcon from "./svg/menu_option";
import RefPost from "./RefPost";
import PostTextContent from "./PostTextContent";
import Comment from "./Comment";

export default {
  name:"Post",
  components:{
      menuOptionsIcon,
      avatarSVG,RefPost,PostTextContent,Comment
  },
  props:["post",'preventOnComment'],
  data(){
      return {
        showOptions:false,
        showCommentBox:false,
        comment:"",
        commentLoadingSpinner:false,
        liked:this.post.liked,
        comments:[],
        completed:false,
        commentsLoading:false,
        commentSkipOffest:0,
        showShareOptions:true
     }
  },
  mounted(){
  },
 computed:{
    ...mapState({
        userid:state=>state.user.id
    }),
 },
  methods:{
      ...mapMutations(['rungl_loader','stopgl_loader','openEditor']),
      like:function(){
          //if not liked  the post
         if(!this.post.liked){
           axios.post("/post/like",{postId:this.post.id}).then(()=>{
                   this.post.liked=true;
                   this.liked=true;
                   this.post.likes++;
           }).catch(()=>{
               //do nothing
           })
         }else{
           axios.post("/post/dislike",{postId:this.post.id}).then(()=>{
                   this.post.liked=false;
                   this.liked=false;
                   this.post.likes--;
           }).catch(()=>{
               //do nothing
           })
         }
      },
      sendComment(){
         if(this.comment.trim()===""){
             return;
         }
         this.commentLoadingSpinner=true;

         axios.post("/post/comment",{
             postId:this.post.id,
             text:this.comment
         }).then(({data})=>{
                this.comment="";
                this.showCommentBox=false;
                this.post.comments++;
                this.commentLoadingSpinner=false;
                if(this.preventOnComment){
                   this.$emit('comment',data.comment);
                }else{
                    this.comments.push(data.comment);
                }
         }).catch(()=>{
             //i dont care
             this.commentLoadingSpinner=false;
         })
      },
      deletePost(){ 
            this.rungl_loader()
            axios.post("/posts/delete",{id:this.post.id}).then(()=>{
                this.$emit('delete',this.post.id);
                this.stopgl_loader();
            }).catch(()=>{
                 this.stopgl_loader();
            })
      },
      edit(){
        this.openEditor({post:{...this.post},callback:this.onEditPost,type:"EDIT"})
      },
      onEditPost(post){
          this.post=post;
          this.$emit("update",post);
      },
      onPostShare(post){
          console.log("shitty",post);
        this.$emit("share",post);
      },
      share:function(){
        this.openEditor({post:{...this.post},callback:this.onPostShare,type:"SHARE"});
      },
  }
}

</script>

<style scoped>
.svg-icon path{
  fill: rgb(11, 34, 82);
}
.post-wrapper{
    flex: 1;
    width: 100%;
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

 .meta-post-info{
     display: flex;
 }
 .meta-post-info .author-img svg{
     width:2rem;
     height: 2rem;
 }
 .meta-post-info .info{
     margin-left: 10px;
     cursor: pointer;
     
 }
 .post-head-info:hover{
    text-decoration: underline;
 }
.meta-post-info .author-name{
    font-size:1.1em;
    color: rgb(9, 38, 66);
    cursor: pointer;
    font-weight: bold;
}
.meta-post-info .author-name:hover{
    text-decoration: underline;
}
.meta-post-info .pub-date{
    font-size: 1em;
    color: rgb(116, 115, 115);
}
.primary-content{
    padding: 10px;
}
 .content{
     font-size: 1.2em;
     color: rgb(12, 11, 11);
     margin-top: 10px;
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
     transition: all 200ms linear;
     cursor: pointer;
     position: relative;
     display: flex;
     align-items: center;
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

  .option-icon{
    padding: 3px;
  }
  .option-icon:hover{
    background: rgb(202, 199, 206);
    display: flex;
    align-items: center;
    border-radius: 50%;
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
    background: rgb(255, 255, 255);
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
     transition: all 300ms cubic-bezier(0.895, 0.03, 0.685, 0.22);
 }
 .action.like:hover, .action.like.active{
     background: rgb(137, 137, 228);
     color: white;
 }
 .devider{
     height: 2px;
     background: rgb(204, 203, 203);
     margin: 5px 10px;
 }
 .label{
     font-weight: bold;
     margin: 10px;
 }


</style>