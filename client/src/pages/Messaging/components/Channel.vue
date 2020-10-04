<template>
    <div class="chatlist-item" @click="$emit('select',channel.id)">
        <div class="chatlist-item-avatar">
            <img src="./icons/Avatar.png" alt="avatar">
        </div>
        <div class="chatlist-item-content">
            <div class="thread-name">{{channelTitle}}</div>
            <div class="last-message">{{lastMessage}}</div>
        </div>
        <div class="info-extras">
            <div class="online-tag">online</div>
        </div>
    </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
const {mapState} =createNamespacedHelpers("user");

export default {
   name:"chatlist-item",
   props:['channel'],
   computed:{
       ...mapState(['user']),
       lastMessage(){
            if(this.channel.messages[0]){
                let last_message=this.channel.messages[0];
                return last_message.message.content;
            }

            return "";
       },
       channelTitle(){
           const current_user_id=this.user.id;
           if(this.channel.is_group){
               const title = this.channel.participants.map(p=>p.username).join(",");
               return title;
           }else{
               //
               const receiver=this.channel.participants.find(p=>p.id!==current_user_id);
               return receiver.username;
           }
       }
   }
}
</script>

<style scoped> 
.chatlist-item-avatar{
    width: 50px;
    height: 50px;
}
.chatlist-item-avatar img{
    width: 100%;
    height: 100%;
}
.chatlist-item{
    display: flex;
    padding: 0.3em;
    border-bottom: 1px solid rgb(219, 213, 213);
    cursor: pointer;
}
.chatlist-item-content{
    padding: 0px 0px 0px 10px;
    flex: 1;
}
.chatlist-item-content .thread-name{
    font-weight: bold;
    font-size: 1.2em;
}
.info-extras{

}
.online-tag{
    color: rgb(7, 165, 7);
}

</style>