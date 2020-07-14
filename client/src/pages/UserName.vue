<template>
  <section>
      <PlainNav/>
      <div class="form">
        <div class="input-wrapper">
            <label for="username">choose a username</label>
            <div class="username-input-wrapper">
                <input type="text" v-model="username" />
                <div class="loader">
                    <div class="load-bar" v-if="unameloader"></div>
                </div>
            </div>
            <div class="username-status error" v-if="unameExists">
                username exists!
            </div>
            <div class="error" v-if="!usernamevalid && username.length">username should only have A-Z,a-z,0-9,_</div>
        </div>
        <div :class="['button',{active:usernamevalid && !this.unameExists}]" @click="signup">Finish</div>
      </div>
  </section>
</template>

<script>
import Axios from 'axios';
import { mapMutations } from 'vuex';
import PlainNav from "../components/PlainNav";
// import debounce from "../utils/debounce"
import loadash from "lodash";

export default {
   name:"Username-view",
   components:{
       PlainNav
   },
   data:()=>({
       username:"",
       unameExists:false,
       regex:/^[a-zA-Z0-9._]{4,}$/,
       userobj:null,
       unameloader:false
   }),
   computed:{
       usernamevalid(){
         return this.regex.test(this.username)
       }
   },
   methods:{
       ...mapMutations(['runLoader','stopLoader']),
       signup(){
           if(!this.usernamevalid || this.unameExists){
               return;
           }
           let newuser={...this.userobj,username:this.username}
           this.runLoader();
           Axios.post("/auth/signup",newuser).then(({data})=>{
               if(data.success==true){
                   localStorage.setItem('token',data.token);
                   this.$router.replace("/");
               }
               this.stopLoader();
           }).catch(()=>{
               this.stopLoader();
           })
       },

    checkUnameAvailability:loadash.debounce(function(){
         this.unameloader=true;
         Axios.post("/auth/checkusername",{username:this.username}).then(()=>{
            this.unameExists=false;
            this.unameloader=false;
         }).catch(()=>{
             this.unameExists=true;
             this.unameloader=false;
         })
    },500)

   },
   watch:{
      username(){
          console.log("calleing");
          this.checkUnameAvailability();
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
    flex-direction: column;
    background: rgb(204, 202, 202);
 }
 .form{
    padding: 1em 1em 0em 1em;
    background: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;   
    max-width: 400px;
    margin: 10px auto;
 }
 .username-input-wrapper{
     display: flex;
     align-items: center;
     border: 1px solid black;
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
     border: none;
     outline: none;
 }
.username-input-wrapper:focus-within{
  border: 1px solid rgb(36, 207, 156);
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
     border-radius: 3px;
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
 .loader{
     padding:5px;
 }
 .load-bar{
     border: 3px solid rgb(250, 250, 250);
     border-top-color: rgb(39, 219, 108);
     border-bottom-color: rgb(6, 14, 59);
     width:20px;
     height:20px;
     border-radius: 50%;
     animation: rotate 1s linear infinite;
 }
 @keyframes rotate {
     from{
         transform: rotate(0deg);
     }
     to{
         transform: rotate(360deg);
     }
 }
 @keyframes transitgrad{
     to{
         background: linear-gradient(90deg,blue,red);
     }
 }
</style>