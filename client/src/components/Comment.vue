<template>
  <div class="comment-wrapper">
      <div class="comment-container">
        <div class="author-image">
            <img src="../assets/png/alien_white.png" alt="avatar">
        </div>
        <div class="comment-main">
            <div class="comment-content">{{comment.content}}</div>
            <div class="info">
                <div class="author-name">{{comment.authorName}}</div>
                <div class="dot"></div>
                <div class="date">{{new Date(comment.timestamp).toLocaleDateString()}}</div>
                <template v-if="comment.author_id==user.id">
                    <div class="dot"></div>
                    <div class="action delete" @click="$emit('commentdelete',comment.comment_id)">delete</div>
                </template>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
   name:"comment",
   props:['comment','onCommentDelete'],
   components:{
      
   },
   computed:{
       ...mapState(['user'])
   },
   methods:{
      
   }
}
</script>

<style scoped>
.comment-container{
    background: rgb(248, 253, 253);
    padding: 2px 2px 2px 5px;
    display: flex;
    border-bottom: 1px solid rgb(212, 207, 207);
    margin: 5px 0px;
    border-left: 2px solid rgba(27, 46, 110, 0.616);
}
.comment-main{
    flex: 1;
    margin-left:5px;
}
.comment-content{
    display: flex;
    flex: 1;
    background: rgb(230, 231, 233);
    padding: 10px;
    border-radius: 30px;
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
     width: 25px;
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

.action.delete{
    color: red;
    cursor: pointer;
}
.action.delete:hover{
    text-decoration: underline;
}
</style>