<template>
    <div class="post-wrapper">
        <div class="card">
            <div class="meta">
                <div class="meta-post-info">
                    <div class="author-img">
                        <Avatar :src="post.profile_pic_url" size="40"/>
                    </div>
                    <div class="info" >
                        <div class="post-head-info" >
                            <span class="author-name">{{post.authorName}}</span>
                            <span class="shared-meta" v-if="post.type==='SHARE'">
                                shared <span class="author-name">{{post.ref_author_username}}'s post</span>
                            </span>
                            <span v-else> shared a post</span>
                        </div>
                        <div class="pub-date">{{publishDate}}</div>
                    </div>
                </div>
                <div class="options" @click="showOptions=!showOptions" v-click-outside="()=>showOptions=false">
                    <div class="option-icon">
                        <menuOptionsIcon/>
                    </div>
                    <div class="options-container"  v-if="showOptions">
                        <div class="option" @click="$router.push({name:'profile',params:{username:post.authorName}})">view profile</div>
                        <div class="option" @click="deletePost" v-if="userid===post.author">Delete</div>
                        <div class="option" @click="edit" v-if="userid===post.author">Edit</div>
                        <div class="option" @click="unfollow" v-if="!post.unfollowd && userid!==post.author">unfollow {{post.authorName}}</div>
                        <div class="option" @click="follow" v-if="post.unfollowd && userid!==post.author">follow {{post.authorName}}</div>
                    </div>
                </div>
            </div>
            <div class="content">
                <PostTextContent v-if="post.content && post.content.trim()!=''" :content="post.content"/>
                <PostImages v-if="post.images" :images="post.images"/>  
                <RefPost v-if="post.type==='SHARE'" :post="post.originalPost" :refAuthorName="post.ref_author_username"/>
            </div>
            <div class="post-stats">
                <div class="likes" @click="showLikes=true">{{post.reactions}} Likes</div>
                <div class="comments" @click="$router.push({name:'postview',params:{postid:post.id}})">{{post.comments}} Comments</div>
            </div>
            
            <div class="last-comment-wrapper" v-if="comments.length>0">
                <div>
                    <div class="devider"></div>
                    <div class="label">Comments</div>
                </div>
               <div class="comments">
                   <Comment 
                   v-for="(comment,i) in comments" 
                   :key="i" 
                   v-on:delete="removeComment" 
                   :comment="comment"/>
               </div>
            </div>
        </div>
        <div class="share-options-wrapper">
           
        </div>
        <div class="comment-box-wrapper" v-if="showCommentBox">
            <div class="comment-box">
                <div class="inputbox">
                    <input type="text" placeholder="start typing..." @keyup.enter="sendComment" v-model="comment" class="comment">
                </div>
                <div :class="['icon', 'send']" @click="sendComment">
                    <Spinner v-if="sendingReply"/>
                    <svg v-else class="svg-icon" viewBox="0 0 20 20">
						<path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
					</svg>
                </div>
            </div>
        </div>
        <div class="actions">
            <div :class="['action' ,'like']" @click="like" @mouseenter="openReactions" @mouseleave="closeReactions">
              <div class="reactions-wrapper">
                    <Reactions v-on:react="updateReaction" v-if="showReactions"/>
              </div>
              <div class="icon">
                <Like :reaction="post.reaction"/>  
              </div>  
                <div class="reaction-text" :class="post.reaction && post.reaction.type">{{post.reaction && post.reaction.type || "LIKE"}}</div>
             </div>
            <div class="action comment"  @click="showCommentBox=!showCommentBox">
               <div class="icon">
                  <CommentIcon/>
                </div> 
               <div class="text">Comment</div>
            </div>
            <div class="action share" @click="share">
                <div class="icon">
                    <ShareIcon/>
                </div>
                <div class="text">Share</div>
            </div>
        </div>
        <transition name="likes">
           <LikeViewer v-on:onclose="showLikes=false" :post_id="post.id" v-if="showLikes"/>
        </transition>
    </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { mapState, mapMutations, createNamespacedHelpers} from 'vuex';
import menuOptionsIcon from "./svg/menu_option";
import RefPost from "./RefPost";
import PostTextContent from "./PostTextContent";
import Comment from "./Comment";
import Axios from 'axios';
import Like from "./Reaction";
import CommentIcon from "./svg/comment";
import ShareIcon from "./svg/share";
import LikeViewer from "./LikeViewer";
import Reactions from "./Reactions";
import PostImages from "./PostImages";
import Spinner from "./Spinner";
import Avatar from "./Avatar";

const {mapMutations:mapEditorMutations} =createNamespacedHelpers('editor');

export default {
  name:"Post",
  components:{
      menuOptionsIcon,
      RefPost,PostTextContent,Comment,Like,
      CommentIcon,ShareIcon,LikeViewer,
      Reactions,
      PostImages,
      Spinner,
      Avatar
  },
  props:["post",'preventOnComment'],
  data(){
      return {
        showOptions:false,
        showCommentBox:false,
        comment:"",
        commentLoadingSpinner:false,
        comments:[],
        completed:false,
        commentsLoading:false,
        commentSkipOffest:0,
        showShareOptions:true,
        showLikes:false,
        showReactions:false,
        reactionTimer:null,
        prevReaction:null,
        sendingReply:false
     }
  },
  mounted(){
  },
 computed:{
    ...mapState({
        userid:state=>state.user.user.id,
        publishDate(){return moment(this.post.createdAt).fromNow()}
    }),
 },
  methods:{
      ...mapMutations(['rungl_loader','stopgl_loader']),
      ...mapEditorMutations(['openEditor']),
      like:function(){
          //if not liked  the post
         this.closeReactions();
         if(!this.post.amIReacted){
               this.updateReaction("LIKE");
         }else{
           axios.post("/post/dislike",{post_id:this.post.id,parent_id:this.post.id}).then(()=>{
                   this.post.amIReacted=false;
                   this.post.reaction=null;
                   this.post.reactions--;
           }).catch(()=>{
               //do nothing
           })
         }
      },
      updateReaction(type){
        console.log(type);
        //update the like type
        this.prevReaction=this.post.reaction;
        this.post.reaction={type};
        if(!this.post.amIReacted){
            this.post.reactions++;
        }
        axios.post("/post/like",{post_id:this.post.id,type}).then(({data:{reaction}})=>{
            this.post.amIReacted=true;
            this.post.reaction=reaction;
        }).catch(()=>{
            //reset the values;
            this.post.reaction=this.prevReaction;
        })
      },
      sendComment(){
         if(this.comment.trim()===""){
             return;
         }
         this.sendingReply=true;

         axios.post("/post/comment",{
             post_id:this.post.id,
             content:this.comment
         }).then(({data})=>{
                this.comment="";
                this.showCommentBox=false;
                this.post.comments++;
                if(this.preventOnComment){
                   this.$emit('comment',data.comment);
                }else{
                    this.comments.push(data.comment);
                }
         }).catch(()=>{
         }).finally(()=>{
             this.sendingReply=false;
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
        this.$emit("share",post);
      },
      share:function(){
        this.openEditor({post:{...this.post},callback:this.onPostShare,type:"SHARE"});
      },
    removeComment(id){
        let index=this.comments.findIndex(comment=>comment.id===id);
        if(index!=-1){
            this.comments.splice(index,1);
            this.post.comments--;
        }
    },
      unfollow(){
          this.rungl_loader();
          Axios.post("/users/unfollow",{userId:this.post.author}).then(()=>{
           this.post.unfollowd=true;
           this.stopgl_loader();             
          }).catch(()=>{
              this.stopgl_loader();
          })
      },
      follow(){
          this.rungl_loader();
          Axios.post("/users/follow",{userId:this.post.author}).then(()=>{
           this.post.unfollowd=true;
           this.stopgl_loader();             
          }).catch(()=>{
              this.stopgl_loader();
          })
      },
      openReactions(){
          clearTimeout(this.reactionTimer);
          this.reactionTimer=setTimeout(()=>{
              this.showReactions=true;
          },300);
      },
      closeReactions(){
          clearTimeout(this.reactionTimer);
          this.showReactions=false;
      }
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
     min-width:150px;
     background: white;
     box-shadow:1px 1px 5px rgba(117, 115, 115, 0.472);
 }

  .option{
   padding:10px;
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
 .post-stats > div:hover{
     cursor: pointer;
     text-decoration: underline;
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

 .action{
     flex: 1;
     display: flex;
     justify-content: center;
     align-items: center;
     padding: 10px 1em;
     background: rgb(255, 255, 255);
     cursor: pointer;
     font-weight: bold;
     color: rgb(61, 59, 59);
 }

 .action.like.active{
     font-weight: bold;
     color: blue;
 }
 .action.like .icon{
     font-size: 2rem;
 }

 .action .icon{
    margin: 0px 5px;
    display: flex;
    align-items: center;
 }
 .action .icon svg{
     width: 30px;
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
 .action.like{
     position: relative;
 }
 .reactions-wrapper{
   position:absolute;
   left: 10px; 
   bottom: 100%;
}


</style>