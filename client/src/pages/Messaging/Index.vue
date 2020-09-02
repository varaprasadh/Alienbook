<template>
  <div class="chat-container">
     <div class="chat-container-box">
         <div class="chat-container-wrapper">
             <div class="chatlist-wrapper">
                 <ChatListHeader/>
                 <div class="chatlist">
                        <ChatListItem/>
                 </div>
             </div>
             <div class="conversation-wrapper">
                <div class="conversation-selected"> 
                    <ConversationHeader/>
                    <div class="conversation">
                         <div class="messages">
                             <div class="message" :class="{self:item%2==0}" v-for="item in [1,2,3,4]" :key="item">hi hello</div>
                         </div>
                    </div>
                    <div class="message-input">
                        <MessageInput/>
                    </div>
                </div>
             </div>
         </div>
     </div>
  </div>
</template>

<script>
import ChatListItem from "./components/ChatListItem";
import ConversationHeader from "./components/ConversationHeader";
import ChatListHeader from "./components/ChatListHeader";
import MessageInput from "./components/MessageInput";

export default {
  name:"messaging",
  components:{
      ChatListItem,
      ChatListHeader,
      ConversationHeader,
      MessageInput
  },
  mounted(){
      //fetch conversations
  }
  //on click conversation 
}
</script>

<style scoped>
   .chat-container{
       background: black;
       min-height: 100vh;
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

</style>