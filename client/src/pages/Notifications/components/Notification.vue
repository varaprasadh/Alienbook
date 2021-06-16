<template>
  <div class="notification-wrapper">
      <div :class="['card notification',{unread:!notification.read}]">
            <div @click="handleClick" class="notification-content">
            <div class="n-icon">
               <div class="avatar">
                    <Avatar :src="notification.from.avatar"/>
               </div>
               <div class="icon">
                   <ActionIcon :type="notification.type" :content="notification.content"/>
               </div>
            </div>
            <div class="content">
                <div><span class="from">{{notification.from.username}}</span> {{action_text}}</div>
                <div class="meta">
                    <div class="time-ago">{{date}}</div>
                    <div class="dot"></div>
                </div>
                <div v-if="notification.type==='MESSAGE'" class="message-container">
                    <div class="text">{{notification.content}}</div>
                </div>
            </div>
        </div>
         <div class="delete-icon" v-click-outside="()=>menuopen=false" @click="menuopen=!menuopen">
            <Menu/>
            <div class="options" v-if="menuopen" >
                <div class="option" v-if="notification.read==false" @click="markAsRead">Mark As Read</div>
                <div class="option" @click="deleteNotification">Delete</div>
            </div>
         </div>
      </div>
  </div>
</template>

<script>
import { mapMutations,createNamespacedHelpers } from 'vuex';
import Menu from "vue-material-design-icons/DotsVertical";
import ActionIcon from "./ActionIcon";
import Avatar from "@/components/Avatar";


import Axios from 'axios';
import moment from 'moment';
import NotificationTypes from "../notification_types";


const {mapMutations:mapNotificationMutations} =createNamespacedHelpers("notificationCentre");
export default {
 name:"notification",
 props:['notification'],
 components:{
     ActionIcon,Menu,Avatar
 },
 data(){
     return ({
         menuopen:false,
         Types:NotificationTypes
     })
 },
 computed:{
    date(){
      return moment(this.notification.timestamp).fromNow()
    },
      action_text(){
          let text="";
          const notification=this.notification;
          if(notification.type===NotificationTypes.REACTION){
              text="reacted to your post!"
          }else if(notification.type===NotificationTypes.COMMENT){
              text="commented on your post!"
          }else if(notification.type===NotificationTypes.FOLLOW){
              text="started following you!"
          }else if(notification.type===NotificationTypes.SHARE){
              text="shared your post!"
          }else if(notification.type===NotificationTypes.REACTED_TO_COMMENT){
              text="reacted to your comment!"
          }else if(notification.type===NotificationTypes.REPLY_TO_COMMENT){
              text="replied to your Comment!"
          }
          return text;
      }
 },
 methods:{
     ...mapNotificationMutations(['removeNotification']),
     ...mapMutations(['rungl_loader','stopgl_loader']),
     markAsRead(){
         this.rungl_loader();
         Axios.post("/notifications/read",{notification_id:this.notification.notification_id}).then(()=>{
           this.notification.read=true;
           this.stopgl_loader()
         }).catch(()=>{
             this.stopgl_loader();
         })
     },
     deleteNotification(){
         //call the api
         this.rungl_loader();
         Axios.post("/notifications/remove",{notification_id:this.notification.notification_id}).then(({data})=>{
             console.log(data);
             this.removeNotification(this.notification.notification_id);
             this.stopgl_loader();
         }).catch(()=>{
             this.stopgl_loader();
         })
     },
     handleClick(){
         this.markAsRead();
         if(this.notification.type==="FOLLOW" || this.notification.type==="MESSAGE"){
             this.$router.push(`/profile/${this.notification.from.username}`)
         }
         if(this.notification.type==="LIKE" || this.notification.type==="COMMENT"){
             this.$router.push(`/post/${this.notification.parent_id}`);
         }
     }
 }

}
</script>

<style scoped>
.notification{
    padding: 0.5rem;
    background: white;
    margin: 5px;
    display: flex;
    align-items: center;
}
.notification-content{
    display: flex;
    cursor: pointer;
}
.notification.unread{
    background: rgb(225, 233, 231);
}
.n-icon{
    margin-right: 1em;
    position: relative;
}
.n-icon .icon{
    position: absolute;
    right: -30%;
    bottom: -30%;
    background: white;
    padding: 2px;
    box-shadow: 1px 1px 3px rgb(219, 218, 218);
    height:24px;
}
.notification .icon svg{
    width:2rem;
    margin-right: 10px;
}

.delete-icon{
 margin-left: auto;
 padding: 10px;
 cursor: pointer;
 border-radius: 50%;
 width: 25px;
 height: 25px;
 display: flex;
 justify-content: center;
 align-items: center;
 position: relative;
 position: relative;
 z-index: 10;
}
.delete-icon::before{
    position: absolute;
    content: "";
    display: block;
    width:0%;
    height:0%;
    background: rgb(240, 245, 247);
    transition: 300ms cubic-bezier(0.39, 0.575, 0.565, 1);
    border-radius: 50%;
    z-index: -1;

}
.delete-icon:hover::before{
    width: 100%;
    height: 100%;
}
.delete-icon:hover{
    /* background: rgb(186, 202, 204); */
}
.notification .content .from{
    color: rgb(3, 3, 185);
    font-weight: bold;
}
.options{
    background: white;
    position: absolute;
    width: 150px;
    right: 100%;
    border: 1px solid black;
}
.options .option{
    padding:10px 15px;
    cursor: pointer;
}
.options .option:hover{
    background: rgb(241, 237, 237);
}
.time-ago{
    font-size: 0.8rem;
    margin: 5px;
}
.meta{
    display: flex;
    align-items: center;
}
.dot{
    width: 7px;
    height: 7px;
    border-radius:50%;
    background: rgb(170, 169, 169);
}
.message-container{
    border: 1px solid black;
    padding: 10px;
    border-radius: 2px;
    box-shadow: 1px 1px 5px rgb(231, 231, 231);
    box-sizing: border-box;
    word-break: break-all;
    max-width: 350px;
}
</style>