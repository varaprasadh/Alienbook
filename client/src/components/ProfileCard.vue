<template>
    <div class="profile-card">
        <div class="profile-main">
            <div class="image">
                <img src="../assets/png/alien_black.png" alt="alien">
            </div>
            <div class="meta">
                <div class="info">
                  <div class="username">{{user.username}}</div>
                  <div class="fullname">{{user.fullName}}</div>
                  <div class="generated-slogan">joined on <span class="date">{{joined}}</span></div>
                </div>
            </div>
        </div>
        <div class="controls" v-if="!user.isSelf">
          <div class="btn message" @click="openMessenger">quick message</div>
          <template v-if="!fl_loading">
            <div class="btn unfollow" v-if="user.amIFollowing" @click="unfollow">unfollow</div>
            <div class="btn follow" v-else @click="follow">Follow</div>
          </template>
          <template v-else>
              <div class="btn loading">wait</div>
          </template>
        </div>
        <div class="devider"></div>
        <div class="activity-info">
            <router-link class="activity followers" :to="'/profile/'+user.username+'/followers'">
                <div class="count">{{user.followers}}</div>
                <div class="label">Followers</div>
            </router-link>
            <router-link class="activity following" :to="'/profile/'+user.username+'/following'">
                <div class="count">{{user.following}}</div>
                <div class="label">Following</div>
            </router-link>
            <div class="activity posts">
                <div class="count">{{user.posts}}</div>
                <div class="label">Posts</div>
            </div>
        </div>
        <QuickMessagePrompt  v-if="quickMessagePrompt"  v-on:message="sendMessage" v-on:cancel="quickMessagePrompt=false"/>
    </div>
</template>

<script>
import Axios from 'axios';
import { mapMutations } from 'vuex';
import moment from "moment";
import QuickMessagePrompt from "./QuickMessagePrompt";
export default {
  name:"profile-card",
  props:['user'],
  components:{
    QuickMessagePrompt
  },
  computed:{
    joined(){return moment(this.user.createdAt).fromNow()},
  },
  data(){
    return ({
      quickMessagePrompt:false,
      fl_loading:false
    })
  },
  created(){
 
  },
  methods:{
    ...mapMutations(['rungl_loader','stopgl_loader']),
      follow(){
        this.fl_loading=true;
        Axios.post("/users/follow",{userId:this.user.id}).then(()=>{
          this.user.amIFollowing=true
        }).catch(()=>{
        }).finally(()=>{
           this.fl_loading=false;
        })
      },
      unfollow(){
         this.fl_loading=true;
         Axios.post("/users/unfollow",{userId:this.user.id}).then(()=>{
          this.user.amIFollowing=false;
        }).catch(()=>{

        }).finally(()=>{
          this.fl_loading=false;
        })
      },
      openMessenger(){
        this.quickMessagePrompt=true;
        
      },
      sendMessage(text){
        this.quickMessagePrompt=false;
        Axios.post("/notifications/message",{to:this.user.id,content:text}).then(({data})=>{
          console.log(data);
          //show custom toast;
        }).catch(err=>{
          console.log(err);
        })
      }
  }
}
</script>

<style>
.profile-card{
   padding: 10px;
   background: white;
 }
  .profile-card .image{
    padding: 10px;
    border-radius: 50%;
    background: rgb(227, 227, 228);
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid rgb(173, 173, 173);
  }
 .profile-card .image img{
   width:60px;
 }
 .profile-main{
   display: flex;
   align-items: center;
 }
 
 .profile-card .meta{
   margin-left: 1rem;
   display: flex;
   flex: 1;
 }
 .meta .username{
   font-weight: bold;
   font-size: 1.5rem;
 }
 .meta .fullname{
   font-weight: bold;
   color: rgb(145, 141, 141);
   padding: 5px 0px;
 }
 .activity{
   text-align: center;
 }
 .activity-info{
   display: flex;
   justify-content: space-around;
   padding: 10px;
 }
 .activity .label{
    font-weight: bold;
 }
 .activity .count{
  font-weight: bold;
  font-size: 1.2rem;
 }
 .generated-slogan{
   font-size: 1.2em;
   color: rgb(46, 43, 43);
 }
 .devider{
   height: 2px;
   background: rgb(216, 215, 215);
   margin: 5px 20px;
 }
 .controls{
   display: flex;
   justify-content: center;
 }
 .controls .btn{
   flex: 1;
   background: blue;
   color:white;
   text-align: center;
   font-size: 1.2rem;
   padding: 5px;
   margin: 5px 0px;
   border-radius: 5px;
   cursor: pointer;
   max-width: 200px;
 }
 .controls .btn.message{
   margin-right: 10px;
 }
 .controls .btn.unfollow{
    background: rgb(245, 92, 92);
 }
 .controls .btn.loading{
    background: rgb(134, 133, 133);
 }
</style>