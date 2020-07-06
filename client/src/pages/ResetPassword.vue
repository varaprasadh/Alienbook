<template>
  <section>
      <PlainNav/>
      <div class="container">
          <div class="form-wrapper">         
          <div class="form" v-if="state==1">
              <div class="input-wrapper">
                  <label for="username">username</label>
                  <input type="text" v-model="username">
                  <div class="error">{{ !isUsernameValid?errors.username:""}}</div>
                  <div class="error">{{ usernameError?errors.usernameError:""}}</div>
              </div>
              <div class="actions">
                  <button class="cancel" @click="$router.replace('/login')">cancel</button>
                  <button :disabled="!isUsernameValid || loading" :class="['next',{active:isUsernameValid}]"  @click="generateOTP">
                      <span v-if="loading">verifying</span>
                      <span v-else>next</span>
                  </button>
              </div>
          </div>
          <div class="form" v-if="state==2">
              <div class="info">
                  enter the code that we have sent to your
                  registerd email!
              </div>
              <div class="input-wrapper">
                  <input type="text" v-model="otp">
                   <div class="error">{{ !isOTPValid?errors.otp:""}}</div>
                   <div class="error" v-if="otpError">invalid otp</div>
              </div>
              <div class="actions">
                  <button class="back" @click="openUsernameForm">back</button>
                  <button :disabled="!isOTPValid || loading" :class="['next',{active:isOTPValid}]" @click="validateOTP">next</button>
              </div>
          </div>
          <div class="form" v-if="state==3">
              <div class="input-wrapper">
                  <label for="password">new password</label>
                  <input type="text" v-model="password">
                   <div class="error">{{ !isPasswordValid?errors.password:""}}</div>
              </div>
              <div class="input-wrapper">
                  <label for="confirm_password">confirm password</label>
                  <input type="text" v-model="confirm_password">
                  <div class="error">{{!isConfirmPasswordValid?errors.confirm_password:""}}</div>
              </div>
              <div class="actions">
                  <button class="back" @click="openUsernameForm">back</button>
                  <button :class="['next',{active:isPasswordValid&&isConfirmPasswordValid}]" :disabled="loading || !isPasswordValid&&isConfirmPasswordValid" @click="resetPassword">
                      <span v-if="loading">resetting</span>
                      <span v-else>Finish</span>
                  </button>
              </div>
          </div>
         </div>
      </div>
  </section>
</template>

<script>
import {mapMutations} from "vuex"
import Axios from 'axios';
import PlainNav from "../components/PlainNav";

export default {
  name:"ResetPassword",
  components:{
    PlainNav
  },
  data:()=>({
      state:1,
      username:"",
      otp:"",
      generatedOTP:"",
      password:"",
      confirm_password:"",
      otpError:false,
      usernameError:false,
      loading:false,
      rules:{
          username:/^[a-zA-Z0-9._]{4,}$/,
          password:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
          otp:/^\d\d\d\d$/
      },
      errors:{
          username:"minimum 4 characters and only a-z,A-Z,_ are allowed",
          password:"should be minimum eight characters, at least one letter and one number",
          otp:"otp contains digits only",
          confirm_password:"password doesn't match",
          usernameError:"username does'nt exist"
      }
  }),
  computed:{
     isUsernameValid(){
         return this.rules.username.test(this.username)
     },
     isPasswordValid(){
         return this.rules.password.test(this.password)
     },
     isOTPValid(){
         return this.rules.otp.test(this.otp)
     },
     isConfirmPasswordValid(){
         return this.password===this.confirm_password && this.password.trim()!=="";
     }
  },
  methods:{
    //   submit
    ...mapMutations(['runLoader','stopLoader']),
    openUsernameForm(){
        this.state=1;
        this.otp="",
        this.password="",
        this.confirm_password=""
    },
    generateOTP(){
        this.loading=true;
        Axios.post("/auth/reset",{username:this.username}).then(({data})=>{
            this.otpHash=data.otpHash;
            this.state++;
            this.usernameError=false;
            this.loading=false;
        }).catch((err)=>{
            this.usernameError=true;
            this.loading=false;
            console.log(err);
        })
    },
    validateOTP(){
        this.loading=true;
        Axios.post("/auth/reset/verifyOTP",{otp:this.otp,otpHash:this.otpHash}).then(()=>{
            this.state++;
            this.otpError=false;
            this.loading=false;
        }).catch(err=>{
            console.log(err);
            this.otpError=true;
            this.loading=false;
            })
    },
    resetPassword(){
       
       if(this.password!==this.confirm_password){
           return;
       }
       let payload={
           username:this.username,
           otpHash:this.otpHash,
           otp:this.otp,
           password:this.password
       }
       this.loading=true;
       Axios.post("/auth/reset/updatePassword",payload).then(()=>{
              this.loading=false;
              this.$router.replace("/");
       }).catch(err=>{
           console.log(err);
         this.loading=false;
        })
    }
  },
  watch:{
      otp(){
          this.otpError=false;
      }
  }
}
</script>

<style scoped>
.container{
    height: 100%;
    display: flex;
    flex-direction: column;
}
.form-wrapper{
    display: flex;
    margin-top: 2rem;
    align-items: center;
    justify-content: center;
}
.input-wrapper{
    display: flex;
    flex-direction: column;
    font-size: 1.2em;
    margin: 10px 0px;
}
.input-wrapper label{
    color: rgb(53, 52, 52);
    padding: 5px 0px;
}
.form{
   background:white;
   border-radius: 5px;
   padding: 10px;
   width: 300px;
   filter: drop-shadow(1px 1px 10px rgb(184, 181, 181))
  }
  input {
      font-size: 1em;
      background: rgb(255, 255, 255);
      padding: 5px;
  }
  .actions{
      display: flex;
      justify-content: space-between;
      margin-top: 0.5em;
  }
  .info{
      color: rgb(16, 51, 92);
      font-weight: bold;
      text-align: center;
  }
  button{
      border: none;
      outline: none;
      background: gray;
      color: white;
      padding: 0.3em 1em;
      font-size: 1.2em;
      border-radius: 2px;
      font-weight: bold;
      cursor: pointer;
  }
  button.back{
     background: rgb(13, 36, 114);
  }
  button.cancel{
     background: rgb(211, 56, 9);
  }
  button.next.active{
       background: rgb(4, 43, 105);
  }
  button:hover{
      filter: brightness(0.8);
  }
  .error{
    color: rgb(192, 75, 55);
    font-size: .8em;
  }
</style>