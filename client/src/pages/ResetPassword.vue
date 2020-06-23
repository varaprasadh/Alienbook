<template>
  <section>
      <div class="container">
          <div class="form-wrapper">         
          <div class="form" v-if="state==1">
              <div class="input-wrapper">
                  <label for="username">username</label>
                  <input type="text" v-model="username">
                  <div class="error">{{ !isUsernameValid?errors.username:""}}</div>
              </div>
              <div class="actions">
                  <div></div>
                  <button :disabled="!isUsernameValid" :class="['next',{active:isUsernameValid}]"  @click="generateOTP">next</button>
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
              </div>
              <div class="actions">
                  <button class="back" @click="openUsernameForm">back</button>
                  <button :disabled="!isOTPValid" :class="['next',{active:isOTPValid}]" @click="validateOTP">next</button>
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
                  <button :class="['next',{active:isPasswordValid&&isConfirmPasswordValid}]"  @click="resetPassword">next</button>
              </div>
          </div>
         </div>
      </div>
  </section>
</template>

<script>
import {mapMutations} from "vuex"
import Axios from 'axios';
export default {
  name:"ResetPassword",
  components:{

  },
  data:()=>({
      state:1,
      username:"",
      otp:"",
      generatedOTP:"",
      password:"",
      confirm_password:"",
      rules:{
          username:/^[a-zA-Z0-9._]{4,}$/,
          password:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
          otp:/^\d\d\d\d$/
      },
      errors:{
          username:"minimum 4 characters and only a-z,A-Z,_ are allowed",
          password:"should be minimum eight characters, at least one letter and one number",
          otp:"otp contains digits only",
          confirm_password:"password doesn't match"
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
        this.runLoader();
        Axios.post("/auth/reset",{username:this.username}).then(({data})=>{
            if(data.success==true){
                this.otpHash=data.otpHash;
                this.state++;
            }
            this.stopLoader();
        }).catch((err)=>{
            //show toast
            this.stopLoader();
            console.log(err);
        })
    },
    validateOTP(){
        this.runLoader();
        Axios.post("/auth/reset/verifyOTP",{otp:this.otp,otpHash:this.otpHash}).then(({data})=>{
            if(data.success==true){
              this.state++;
            }
            this.stopLoader();
        }).catch(err=>{
            console.log(err);
            this.stopLoader();
        })
    },
    resetPassword(){
       this.runLoader();
       if(this.password!==this.confirm_password){
           return;
       }
       let payload={
           username:this.username,
           otpHash:this.otpHash,
           otp:this.otp,
           password:this.password
       }
       Axios.post("/auth/reset/updatePassword",payload).then(({data})=>{
           if(data.success==true){
              alert("password updted success");
              this.$router.replace("/");
           }
           this.stopLoader();
       }).catch(err=>{
           console.log(err);
           this.stopLoader();
       })
    }
  }
}
</script>

<style scoped>
.container{
    min-height: 100vh;
    display: flex;
    /* align-items: center; */
    flex-direction: column;
}
.form-wrapper{
    display: flex;
    flex:1;
    align-items: center;
    justify-content: center;
}
.input-wrapper{
    display: flex;
    flex-direction: column;
    font-size: 1.2em;
    margin: 10px 0px;
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
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
  }
  button.back{
     background: rgb(35, 189, 130);
  }
  button.next.active{
       background: rgb(35, 189, 130);
  }
  button:hover{
      filter: brightness(0.8);
  }
  .error{
    color: rgb(192, 75, 55);
    font-size: .8em;
  }
</style>