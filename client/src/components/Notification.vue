<template>
  <div class="notification-wrapper">
      <div :class="['card notification',{unread:!notification.read}]">
            <div @click="handleClick" class="notification-content">
            <div class="icon">
                <svg class="like" v-if="notification.type==='LIKE'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M53.333 224C23.936 224 0 247.936 0 277.333V448c0 29.397 23.936 53.333 53.333 53.333h64c12.011 0 23.061-4.053 32-10.795V224h-96zM512 304c0-12.821-5.077-24.768-13.888-33.579 9.963-10.901 15.04-25.515 13.653-40.725-2.496-27.115-26.923-48.363-55.637-48.363H324.352c6.528-19.819 16.981-56.149 16.981-85.333 0-46.272-39.317-85.333-64-85.333-22.165 0-37.995 12.48-38.677 12.992A10.72 10.72 0 00234.667 32v72.341l-61.44 133.099-2.56 1.301v228.651C188.032 475.584 210.005 480 224 480h195.819c23.232 0 43.563-15.659 48.341-37.269 2.453-11.115 1.024-22.315-3.861-32.043 15.765-7.936 26.368-24.171 26.368-42.688 0-7.552-1.728-14.784-5.013-21.333C501.419 338.731 512 322.496 512 304z"/></svg>
                <svg class="comment" v-if="notification.type==='COMMENT'" id="Capa_1" viewBox="0 0 511.096 511.096" width="512" xmlns="http://www.w3.org/2000/svg"><g id="Speech_Bubble_48_"><g><path d="m74.414 480.548h-36.214l25.607-25.607c13.807-13.807 22.429-31.765 24.747-51.246-59.127-38.802-88.554-95.014-88.554-153.944 0-108.719 99.923-219.203 256.414-219.203 165.785 0 254.682 101.666 254.682 209.678 0 108.724-89.836 210.322-254.682 210.322-28.877 0-59.01-3.855-85.913-10.928-25.467 26.121-59.973 40.928-96.087 40.928z"/></g></g></svg>
                <svg class="share" v-if="notification.type==='SHARE'" viewBox="0 -22 512 511"  xmlns="http://www.w3.org/2000/svg"><path d="m512 233.820312-212.777344-233.320312v139.203125h-45.238281c-140.273437 0-253.984375 113.710937-253.984375 253.984375v73.769531l20.09375-22.019531c68.316406-74.851562 164.980469-117.5 266.324219-117.5h12.804687v139.203125zm0 0"/></svg>
                <svg class="follow" v-if="notification.type==='FOLLOW'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497 80.333h-65.334V15c0-8.284-6.716-15-15-15s-15 6.716-15 15v65.333h-65.332c-8.284 0-15 6.716-15 15s6.716 15 15 15h65.332v65.334c0 8.284 6.716 15 15 15s15-6.716 15-15v-65.334H497c8.284 0 15-6.716 15-15s-6.716-15-15-15zM175.666 321.334C78.804 321.334 0 400.138 0 497c0 8.284 6.716 15 15 15h321.334c8.284 0 15-6.716 15-15 0-96.862-78.805-175.666-175.668-175.666zM175.666 64.267c-52.566 0-95.332 42.767-95.332 95.334s42.766 95.333 95.332 95.333c52.567 0 95.334-42.766 95.334-95.333s-42.767-95.334-95.334-95.334z"/></svg>
            </div>
            <div class="content">
                <div v-if="notification.type==='LIKE'"><span class="from">{{notification.from}}</span> liked your post</div>
                <div v-if="notification.type==='COMMENT'"><span class="from">{{notification.from}}</span> commented on your post</div>
                <div v-if="notification.type==='SHARE'"><span class="from">{{notification.from}}</span> shared your post</div>
                <div v-if="notification.type==='FOLLOW'"><span class="from">{{notification.from}}</span> started following you!</div>
                <div class="meta">
                    <div class="time-ago">{{date}}</div>
                    <div class="dot"></div>
                </div>
            </div>
        </div>
         <div class="delete-icon" v-click-outside="()=>menuopen=false" @click="menuopen=!menuopen">
            <MenuOptionIcon/>
            <div class="options" v-if="menuopen" >
                <div class="option" v-if="notification.read==false" @click="markAsRead">Mark As Read</div>
                <div class="option" @click="deleteNotification">Delete</div>
            </div>
         </div>
      </div>
  </div>
</template>

<script>
import MenuOptionIcon from "../components/svg/menu_option";
import { mapMutations } from 'vuex';
import Axios from 'axios';
import moment from 'moment';

export default {
 name:"notification",
 props:['notification'],
 components:{
     MenuOptionIcon
 },
 data(){
     return ({
         menuopen:false
     })
 },
 computed:{
  date(){
      return moment(this.notification.timestamp).fromNow()
      }
 },
 methods:{
     ...mapMutations(['rungl_loader','stopgl_loader','removeNotification']),
     markAsRead(){
         this.rungl_loader();
         Axios.post("/notifications/read",{notification_id:this.notification.notification_id}).then(()=>{
           this.notification.read=true;
           this.stopgl_loader()
         }).catch(()=>{
             this.stopgl_loader();
         })
     },
     test(){
        alert("sg");  
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
         if(this.notification.type==="FOLLOW"){
             this.$router.push(`/profile/${this.notification.from}`)
         }
         if(this.notification.type==="LIKE" || this.notification.type==="COMMENT"){
             this.$router.push(`/post/${this.notification.postId}`);
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
    cursor: pointer;
}
.notification-content{
    display: flex;
}
.notification.unread{
    background: rgb(225, 233, 231);
}
.notification .icon svg{
    width:2rem;
    margin-right: 10px;
}
.notification .icon svg.like{
    fill: rgb(119, 119, 226);
}
.notification .icon svg.comment{
    fill: rgb(103, 22, 179);
}
.notification .icon svg.share{
    fill: black;
}
.notification .icon svg.follow{
    fill: rgb(191, 32, 212);
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
}
.delete-icon:hover{
    background: rgb(212, 212, 212);
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
</style>