<template>
  <section>
      <div class="form">
              <div class="input-wrapper">
                 <label for="username">choose a username</label>
                 <input type="text" v-model="username" />
                 <div class="loading-bar"></div>
                 <div class="username-status error" v-if="show_username_status">
                     username exists!
                 </div>
                 <div class="error" v-if="!usernamevalid">username should only have A-Z,a-z,0-9,_</div>
              </div>
              <div :class="['button',{active:usernamevalid}]" @click="signup">SIGNUP</div>
      </div>
  </section>
</template>

<script>
import Axios from 'axios';
import { mapMutations } from 'vuex';
export default {
   name:"Username-view",
   data:()=>({
       username:"",
       show_username_status:false,
       regex:/^[a-zA-Z0-9._]{4,}$/,
       userobj:null
   }),
   computed:{
       usernamevalid(){
         return this.regex.test(this.username);
       }
   },
   methods:{
       ...mapMutations(['runLoader','stopLoader']),
       signup(){
           if(!this.usernamevalid){
               return;
           }
           let newuser={...this.userobj,username:this.username}
           this.runLoader();
           Axios.post("/auth/signup",newuser).then(({data})=>{
               if(data.success==true){
                   alert("sucess");
                   localStorage.setItem('token',data.token);
                   this.$router.replace("/auth/tags");
               }
               this.stopLoader();
           }).catch(()=>{
               //
               this.stopLoader();
           })
       }
   },
   mounted(){
     let searchParams=new URLSearchParams(decodeURIComponent(location.search))
     this.userobj=JSON.parse(searchParams.get('data'));
   }
}
</script>

<style scoped>
 section{
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(19, 17, 17);
 }
 .form{
    padding: 1em 1em 0em 1em;
    background: rgb(37, 36, 36);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    color: white;
   
 }
 .input-wrapper{
    display: flex;
    flex-direction: column;
    min-width: 300px;
    transition: all 0.5s linear;
 }
 .input-wrapper input{
     font-size: 1.2em;
     padding: 5px 0.5em;
 }
 label{
     font-weight: bold;
     margin-bottom: 10px;
 }
 .button{
     padding: 0.5em 1em;
     background: rgb(92, 95, 92);
     margin: 0.5em;
     color: white;
     font-weight: bold;
     cursor: pointer;
     border-radius: 5px;
 }
 .button.active{
     background: rgb(0, 168, 0);
 }
  .button:hover{
      filter: brightness(0.8);
  }
 .error{
     color: tomato;
 }
 .loading-bar{
     height: 5px;
     background: linear-gradient(90deg,red,blue);
     animation: transitgrad 1s ease infinite;
     margin: 10px 0px;
 }
 @keyframes transitgrad{
     to{
         background: linear-gradient(90deg,blue,red);
     }
 }
</style>