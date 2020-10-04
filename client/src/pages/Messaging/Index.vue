<template>
  <div class="chat-container">
     <div class="chat-container-box">
         <div class="chat-container-wrapper">
            <transition name="inbox">
                <div class="chatlist-wrapper" v-if="showBoth || currentTab===0">
                    <ChannelsHeader @newChannel="showcreateconv=true"/>
                    <div class="chatlist">
                        <div v-if="channelsLoading" class="channels-loader-wrapper">
                            <Spinner/>
                            <div class="loading-text">please wait...</div>
                        </div>
                            <Channel 
                                v-for="(channel,i) in channels" 
                                :key="i" :channel="channel" 
                                @select="setcurrentChannelId"/>
                    </div>
                    <transition name="cc-slide" >
                        <ConversationCreator @create="startNewChannel" v-if="showcreateconv" @close="showcreateconv=false"/>
                    </transition>
                </div>
             </transition>
             <transition name="thread">
                <div class="conversation-wrapper" v-if="showBoth || currentTab===1">
                    <div class="conversation-selected"> 
                        <ConversationHeader @back="()=>this.currentTab=0" :backNav="isMobile()"/>
                        <div class="conversation">
                            <div class="messages" v-if="currentChannelId!==-1">
                                <div v-for="(message,i) in currentChannel.messages" :key="i">{{message}}</div>
                            </div>
                        </div>
                        <div class="message-input">
                            <MessageInput @onsend="sendMessage"/>
                        </div>
                    </div>
                </div>
             </transition>
         </div>
     </div>
  </div>
</template>

<script>
import Channel from "./components/Channel";
import ConversationHeader from "./components/ConversationHeader";
import ChannelsHeader from "./components//ChannelsHeader";
import MessageInput from "./components/MessageInput";
import ConversationCreator from "./components/ConversationCreator";
import Spinner from "../../components/Spinner";


import Axios from 'axios';

import {createNamespacedHelpers} from 'vuex';
const {mapActions} =createNamespacedHelpers("user");

export default {
  name:"messaging",
  components:{
      Channel,
      ChannelsHeader,
      ConversationHeader,
      MessageInput,
      ConversationCreator,
      Spinner
  },
  data(){
      return ({
          showcreateconv:false,
          channels:[],
          currentChannelId:-1,
          showBoth:false,
          currentTab:0,
          channelsLoading:true
          // Number 
      })
  },
  computed:{
     currentChannel(){
         return this.channels.find(({id})=>id===this.currentChannelId);
     }
  },

  mounted(){
      //fetch conversation
      this.showBoth=!this.isMobile();
      this.loadUserInfo();
      this.fetchUserChannels();
  },
  methods:{
      //check if channel exists with same participents
      //make preflight request
      //pariticipents comes without current user
       ...mapActions(['loadUserInfo']),

       startNewChannel(participents){
           if(participents.length==1){
            // check if its exist
            // if exists put tha
            //else put a temporary channel visible to creator
           }else{
            // put a temporary channel //visible to creator 
           }

           console.log(participents,'hehe');
           const channel={
            participents,
            messages:[],
            isNew:true,
            isGroup:participents.length>2
            }
           this.channels.unshift(channel);
       },
       sendMessage(raw_message){
            //
           console.log("message_to be sent:",raw_message);
           //get current thread id
           // if current thread is new send particiepnts data
           //

       },
       isMobile(){
          return window.innerWidth<=600;
       },
       fetchUserChannels(){
          this.channelsLoading=true;
          Axios.get("/chat/channels").then(({data})=>{
              this.channels=data.channels;
          }).catch(()=>{

          }).finally(()=>{
             this.channelsLoading=false;
          })
       },
       setcurrentChannelId(channel_id){
           this.currentChannelId=channel_id;
           this.currentTab=1;
       }
  }
}
</script>

<style scoped>
   .chat-container{
       background: black;
       height: 100vh;
       box-sizing: border-box;
       display: flex;
       padding: 5em;
   }
   .chat-container-box{
      flex: 1;
      background: rgb(255, 255, 255);
      display: flex;
   }
   .chat-container-wrapper{
       display: flex;
       flex: 1;
   }
   .chatlist-wrapper{
       background: rgb(255, 255, 255);
       border-right: 1px solid rgb(131, 130, 130);
       flex: 1;
       position: relative;
       overflow-x: hidden;
   }
   .conversation-wrapper{
       flex: 2;
       display: flex;
   }
 .conversation-selected{
     flex: 1;
     display: flex;
     flex-direction: column;
 }
 .conversation-selected .message-input{
     margin-top: auto;
 }
 
.channels-loader-wrapper{
   text-align: center;
   padding: 1em;
} 
  
  
 .message{
     padding: 1em;
     background: blue;
     margin: 10px;
 }
 .message.self{
     padding: 1em;
     background: rgb(213, 220, 223);
     margin: 10px;
 }
   @media screen and (max-width: 900px) {
    .chat-container{
        padding: 0px;
    }
   }


.inbox-enter,.inbox-leave-to{
    transform: translatex(-100%);
}
.inbox-enter-to{
    transform: translateX(0%);
}
.inbox-enter-active
{
    transition: all 300ms;
}

.thread-enter,.thread-leave-to{
    transform: translatex(100%);
}
.thread-enter-to{
    transform: translateX(0%);
}
.thread-enter-active
{
    transition: all 300ms;
}
</style>