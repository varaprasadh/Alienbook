<template>
    <div class="create-conversation-wrapper" >
        <div class="header">
           <div class="icon back" @click="$emit('close')">
             <ArrowLeft/>
           </div>
           <div class="title">New Conversation</div>
           <div class="icon-text next" @click="startNewChannel">
              next
           </div>
        </div>
        <div class="searchbar-wrapper">
          <div class="selected-participents">
          </div>
          <div class="searchbar">
             <div class="input">
               <input type="text" placeholder="search people.." class="people-search" v-model="q_name">
             </div>
             <svg class="icon search" xmlns="http://www.w3.org/2000/svg" height="136pt" viewBox="-1 0 136 136.219" width="136pt"><path d="M93.148 80.832c16.352-23.09 10.883-55.062-12.207-71.41S25.88-1.461 9.531 21.632C-6.816 44.723-1.352 76.693 21.742 93.04a51.226 51.226 0 0055.653 2.3l37.77 37.544c4.077 4.293 10.862 4.465 15.155.387 4.293-4.075 4.465-10.86.39-15.153a9.21 9.21 0 00-.39-.39zm-41.84 3.5c-18.245.004-33.038-14.777-33.05-33.023-.004-18.246 14.777-33.04 33.027-33.047 18.223-.008 33.008 14.75 33.043 32.972.031 18.25-14.742 33.067-32.996 33.098h-.023zm0 0"/></svg>
          </div>
        </div>
        <div class="selected-users">
          <div class="selected-user" v-for="(participent,i) in participents" :key="i">
            <div class="username">{{participent.username}}</div>
            <div class="icon remove" @click="(e)=>removeParticipent(participent.id)"> 
               <Plus fillColor="black"/>
            </div>
          </div>
        </div>
        <div class="people">
             <div class="loading" v-if="loading">
                <Spinner/>
             </div>
            <template v-else>
              <div v-if="people.length==0" class="fallback no-people">
                 <div class="icon">
                    <Information fillColor="rgb(109, 106, 106)"/>
                 </div>
                 couldn't find any people
              </div>
              <div class="listing-title" v-if="q_name.trim()===''">
                Recommended
              </div>
              <ChatUser @select="addPaticipent" v-for="(peep,i) in people" :key="i" :user="peep"/>
            </template>
        </div>
    </div>
</template>

<script>
import ArrowLeft from "vue-material-design-icons/ArrowLeft";
import Plus from "vue-material-design-icons/Plus";
import Spinner from "@/components/Spinner";
import Information from "vue-material-design-icons/Information"
import ChatUser from "./ChatUser";
import Axios from 'axios';
import _ from 'lodash'

export default {
  name:"create-conversation",
  components:{
    ChatUser,
    ArrowLeft,
    Plus,
    Spinner,
    Information
  },
  data(){
    return ({
      participents:[],
      people:[],
      q_name:"",
      loading:true,
      cancelToken:null
    });
  },
  methods:{
    addPaticipent(participent){
      const user_id=participent.id;
      if(!user_id) return;
      const user=this.participents.find(obj=>obj.id===user_id);
      if(user) return;
      this.participents.push(participent);
    },
    removeParticipent(user_id){
       this.participents=this.participents.filter(participent=>{
           return participent.id!==user_id;
       });
    },
    startNewChannel(){
       if(this.participents.length<1){
         return;
       }
       this.$emit("create",[...this.participents]);
       this.$emit('close');
    },
     _loadPeople: _.throttle(function(){
        if(this.cancelToken){
          this.cancelToken.cancel("terminated prev request");
        }
        this.cancelToken = Axios.CancelToken.source();
        this.loading=true;
        Axios.get("/chat/people",{params:{q_name:this.q_name},cancelToken:this.cancelToken.token}).then(({data})=>{
           this.people=data.people;
        }).catch(()=>{
           
        }).finally(()=>{
           this.loading=false;
        })
     }, 2000)
  },
  watch:{
    q_name(){
      this._loadPeople();
    }
  },
  mounted(){
     this._loadPeople();
  }
}
</script>

<style scoped>
.create-conversation-wrapper{
    position: absolute;
    top:0px;
    left:0px;
    width: 100%;
    height: 100%;
    background: rgb(252, 252, 252);
    box-sizing: border-box;
}

.header{
  display: flex;
  align-items: center;
  padding: 0.5em 0.5em;
  border-bottom: 1px solid rgb(180, 177, 177);
}

.icon{
  width: 1.5em;
  height: 1.5em;
  padding: 0.1em;
  cursor: pointer;
}
.icon.search{
  fill: rgb(118, 119, 121);
}
.icon.remove{
  transform: rotate(45deg);
}
.icon-text.next{
  color: rgb(53, 1, 88);
  background: rgb(198, 247, 216);
  border-radius: 5px;
  padding: 0.2em 0.6em;
  cursor: pointer;
}
.icon-text:hover{
  filter: brightness(0.9);
}
.loading{
  text-align: center;
  padding: 1em;
}
.searchbar{
  display: flex;
  align-items: center;
  padding:0.5em;
  border-bottom: 1px solid gray;
  box-sizing: border-box;
}
.searchbar .input{
  flex: 1;
}
.searchbar .input input{
  width: 100%;
  font-size: 1.2em;
  outline: none;
  border: none;
}
.header .title{
  flex: 1;
  text-align: center;
  font-weight: bold;
  color: rgb(0, 6, 12);
}
.selected-users{
  display: flex;
  flex-wrap: wrap;
}
.selected-users .selected-user{
  display: flex;
  align-items: center;
  background: rgb(221, 253, 255);
  color: white;
  margin: 2px;
}
.selected-user .username{
  color: rgb(1, 129, 138);
}
.fallback.no-people{
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6em;
  margin: 0.6em;
  color: rgb(109, 106, 106);
}
.listing-title{
  font-weight: bold;
  padding: 0.2em;
  font-size: 0.9em;
}

.cc-slide-enter,.cc-slide-leave-to{
  transform: translateX(100%);
}

.cc-slide-enter-active,
.cc-slide-leave-active
{
   transition: transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

</style>