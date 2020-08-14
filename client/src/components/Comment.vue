
<template>
  <div class="comment-wrapper">
      <div class="comment-container">
        <div class="author-image">
            <img src="../assets/png/alien_white.png" alt="avatar">
        </div>
        <div class="comment-root-column">
            <div class="comment-main">
            <div class="comment">
                    <div class="info">
                        <div class="author-name">{{comment.authorName}}</div>
                        <div class="dot"></div>
                        <div class="date">{{date}}</div>
                    </div>
                    <div class="comment-content-wrapper">
                        <div class="comment-content">{{comment.content}}</div>
                        <div class="options-wrapper" v-click-outside="()=>showOptions=false">
                            <div class="icon" @click="showOptions=!showOptions">
                                <MenuIcon/>
                            </div>
                            <div class="options-container">
                                <div class="options" v-if="showOptions">
                                    <div class="option" v-if="comment.user_id===user.id" @click="deleteComment">Delete</div>
                                    <div class="option" v-if="comment.user_id!==user.id" @click="report">Report</div>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="actions">
                        <div class="action" @click="like" @mouseenter="openReactions" @mouseleave="closeReactions">
                            <div class="reactions-wrapper">
                                <Reactions v-on:react="updateReaction" v-if="showReactions"/>
                            </div>
                            <Reaction :reaction="comment.reaction" />
                            <div class="text reaction-text" :class="comment.reaction && comment.reaction.type">{{comment.reaction && comment.reaction.type || "like"}}</div>
                        </div>
                        <div class="action" @click="openReplyBox">
                            <div class="icon"><CommentIcon/></div>
                            <div class="text">reply</div>
                        </div>
                        <div class="action" @click="loadReplies" v-if="comment.depth<=2">
                            <div class="text">{{comment.comments}} replies</div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="reply-input-box" v-if="showReplyBox">
                <div class="reply-input-wrapper">
                    <input type="text" ref="replyInput" @keyup.enter="sendReply" class="reply-input" v-model="reply">
                    <Spinner v-if="sending"/>
                    <div v-else class="action text" @click="sendReply">send</div>
                </div>
            </div>
            <div class="replies-container">
                <div class="reply-list" v-if="replies.length>0">
                    <div class="title">Replies</div>
                    <comment-component
                         v-for="(reply,i) in replies" 
                         :key="i" 
                         :comment="reply"
                         @delete="removeComment"
                         @editReply="openReplyBox"
                    />
                    <div class="load-more" v-if="!completed"> 
                       <div class="text" @click="loadReplies">load more</div>
                    </div>
                </div>
                <div v-if="loading"> 
                    <BottomLoadBar/>
                </div>
            </div>
        </div>
      </div>
      <div class="overlay" v-if="deleting">
          <Spinner color="gray"/>
      </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */

import { createNamespacedHelpers } from 'vuex';
const {mapState:mapUserState}=createNamespacedHelpers("user");
import moment from "moment";
import MenuIcon from "./svg/menu_option";
import Axios from "axios";
import CommentIcon from "./svg/comment";
import Reaction from "./Reaction";
import Reactions from "./Reactions";
import BottomLoadBar from "./BottomLoadBar";
import Spinner from "./Spinner";

export default {
   name:"comment-component",
   props:['comment','onCommentDelete'],
   components:{
      MenuIcon,CommentIcon,Reaction,Reactions,BottomLoadBar,
      Spinner
   },
   data(){
       return ({
         completed:false,
         skip:0,
         replies:[],
         loading:false,
         reply:"",
         sending:false,
         showReplyBox:false,
         reactionTimer:null,
         showReactions:false,
         showOptions:false,
         deleting:false
       })
   },
   computed:{
       ...mapUserState(['user']),
       date(){return moment(this.comment.timestamp).fromNow()}
   },
   mounted(){
   },

   methods:{
      loadReplies(){
            if(this.loading || this.completed){
                return
            }
            this.loading=true;
            Axios.get("/post/comments",{params:{post_id:this.comment.post_id,parent_id:this.comment.id, skip:this.skip}})
            .then(({data})=>{
                console.log(data);
                this.replies.push(...data.comments);
                this.replies=[...new Map(this.replies.map(reply => [reply['id'],reply])).values()]
                this.completed=data.completed;
                this.skip=this.skip+data.comments.length;
            }).catch(err=>{
                console.log(err);
            }).finally(()=>{
                this.loading=false;
            })

      },
      sendReply(){
        if(this.reply.trim()===""){
            return;
        }
        if(this.sending){
            return;
        } 
        this.sending=true;
        Axios.post("/post/comment",{post_id:this.comment.post_id,parent_id:this.comment.id,content:this.reply})
        .then(({data})=>{
          this.replies.push(data.comment);
          this.showReplyBox=false;
          this.reply="";
          this.comment.comments++;
        }).catch(err=>{
            console.log(err);
        }).finally(()=>{
            this.sending=false;
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
      },
      like(){
          //if not liked  the post
         this.closeReactions();
         if(!this.comment.amIReacted){
               this.updateReaction("LIKE");
         }else{
           Axios.post("/post/dislike",{post_id:this.comment.post_id,parent_id:this.comment.id}).then(()=>{
                   this.comment.amIReacted=false;
                   this.comment.reaction=null;
                   this.comment.reactions--;
           }).catch(()=>{
               //do nothing
           })
         }
      },
      updateReaction(type){
        console.log(type);
        //update the like type
        this.prevReaction=this.comment.reaction;
        this.comment.reaction={type};
        if(!this.comment.amIReacted){
            this.comment.reactions++;
        }
        Axios.post("/post/like",{post_id:this.comment.post_id,type,parent_id:this.comment.id}).then(({data:{reaction}})=>{
            this.comment.amIReacted=true;
            this.comment.reaction=reaction;
        }).catch(()=>{
            //reset the values;
            this.comment.reaction=this.prevReaction;
        })
      },
      openReplyBox(){
          if(this.comment.depth>=3){
              //
              this.$emit("editReply");
              return;
          }
          this.showReplyBox=!this.showReplyBox;
      },
     deleteComment(){
         this.deleting=true;
       Axios.post("/post/uncomment",{comment_id:this.comment.id}).then(()=>{
          console.log("deleted");
          this.$emit("delete",this.comment.id);
       }).catch(()=>{
         //
       }).finally(()=>{
           this.deleting=false;
       })
     },
     removeComment(id){
         console.log("debug",id);
       let index=this.replies.find(comment=>comment.id===id);
       if(index!=-1){
           this.replies.splice(index,1);
           this.comment.comments--;
       }
     },
     report(){
         this.emit("app:report",{type:"comment",id:this.comment.id});
     }
   }
}
</script>

<style scoped>
.comment-wrapper{
    /* background: gray; */
    position: relative;
    overflow-x: hidden;
}
.comment-container{
    background: rgb(250, 255, 255);
    padding: 2px 2px 2px 5px;
    display: flex;
    border-bottom: 1px solid rgb(212, 207, 207);
    margin: 5px 0px;
    border-left: 2px solid rgba(27, 46, 110, 0.616);
    box-sizing: border-box;
}
.comment-root-column{
    flex: 1;
    /* background:rgb(218, 224, 224); */
    padding: 0px 3px;
}
.comment{
    flex: 1;
}
.comment-main{
    flex: 1;
    display:flex;
}
.comment-content-wrapper{
    display: flex;
}

.comment-content{
    display: flex;
    flex: 1;
    background: rgba(224, 219, 219, 0.452);
    padding: 10px;
    border-radius: 5px;
}
.info{
    margin-left: 10px;
    display: flex;
    align-items: center;
}
.dot{
    width:5px;
    height:5px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.698);
    margin: 0px 5px;
}
.author-name{
    font-size: 0.9em;
    font-weight: bold;
    color: rgb(5, 5, 37);
}
.date{
    font-size: 0.8em;
    color: rgb(53, 52, 52);
}
 .author-image{
     border-radius: 50%;
     min-width: 25px;
     height: 25px;
     background: rgb(84, 28, 173);
     display: flex;
     justify-content: center;
     align-items: center;
     padding: 5px;
 }
.author-image img{
   width: 1em;
}

.actions{
    display: flex;
    position: relative;
}
.actions .action{
    padding: 2px .2em;
    cursor: pointer;
}
.options-wrapper{
    /* display: flex; */
    /* align-items: center; */
}
.options-wrapper .icon{
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(90deg);
    background: white;
    padding: 0.5em;
    border-radius: 50%;
    margin-left: 5px;
}
.replies-container{
    /* background: lightblue; */
}
.view-reply{
    color: rgb(0, 54, 170);
    position: relative;
}

.reply-input-box{
    flex: 1;
}
.reply-input-wrapper{
    display: flex;
    flex: 1;
    border: 1px solid black;
    align-items: center;
    background: white;
    padding: 0.2em 1em;
    border-radius:1em;
}
.reply-input{
    flex: 1;
    border: none;
    outline: none;
    padding: 0.2em 0.2em;
    font-size: 1em;
}
 .reactions-wrapper{
   position: absolute;
   bottom: 100%;
   left: 10px;
   position:absolute;
}

.action{
    display: flex;
}
.action .text{
    color: rgb(59, 59, 231);
    cursor: pointer;
    margin-left: 5px;
    text-transform: lowercase;

}
.load-more .text{
    cursor: pointer;
    color: blue;
    text-decoration: underline;
}
.options-container{
    position: relative;
}
.options-wrapper .options{
    position: absolute;
    background: white;
    right:10px;
    border: 1px solid black;
    z-index: 1;
}
.options-wrapper .options .option{
    padding: 0.5em 1em;
    width: 100%;
}
.overlay{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0px;
    left: 0px;
    background: rgba(211, 207, 207, 0.438);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>