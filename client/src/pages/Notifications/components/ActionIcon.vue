<template>
    <div class="icon-container">
        <template v-if="type===Types.REACTION || type===Types.REACTED_TO_COMMENT">
            <img  v-if="content==='LIKE'" src="../icons/reactions/like.svg" alt="angry" class="icon reaction">
            <img  v-if="content==='LOVE'" src="../icons/reactions/love.svg" alt="angry" class="icon reaction">
            <img  v-if="content==='HAHA'" src="../icons/reactions/haha.svg" alt="angry" class="icon reaction">
            <img  v-if="content==='CARE'" src="../icons/reactions/care.svg" alt="angry" class="icon reaction">
            <img  v-if="content==='WOW'" src="../icons/reactions/wow.svg"  alt="angry" class="icon reaction">
            <img  v-if="content==='ANGRY'" src="../icons/reactions/angry.svg" alt="angry" class="icon reaction">
        </template>
        <!-- <Comment fillColor="#fb3958" v-if="type===Types.REACTED_TO_COMMENT"/> -->
        <Comment fillColor="#fb3958" v-if="type===Types.COMMENT"/>
        <Comment fillColor="#fb3958" v-if="type===Types.REPLY_TO_COMMENT"/>
        <PlusNetwork fillColor="blue" v-if="type===Types.FOLLOW"/>
        <Share fillColor="darkblue" v-if="type===Types.SHARE"/>
    </div>
</template>

<script>
import PlusNetwork from "vue-material-design-icons/PlusNetwork";
import Share from "vue-material-design-icons/Share";
import Comment from "vue-material-design-icons/CommentAccount";

import NotificationTypes from "../notification_types";


export default {
   name:"notification-icon",
   props:['type',"content"],
   data(){
       return({
            Types:NotificationTypes
       })
   },
   components:{
       PlusNetwork,Share,Comment
   }
}
</script>

<style scoped>
.icon.reaction{
    width: 24px;
    height: 24px;
}
</style>