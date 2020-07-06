<template>
  <section>
    <PlainNav/>
    <div class="auth-container">
      <div class="form-container">
        <transition name="form" :duration="{ enter:500, leave: 500 }" mode="out-in">
          <div key="signup" v-if="tab=='signup'" class="signup">
            <form  @submit.prevent="signup" action="#" ref="form" v-if="signupStage==1">
              <div class="form-title">
                <div class="title">SIGNUP</div>
              </div>
              <div class="form-field">
                <label for="username">Email</label>
                <input type="email" name="email" id="email" v-model="email" />
                <div class="error">{{ !rules.email.test(email)?errors.email:""}}</div>
                <div class="error">{{ emailError?errors.emailError:""}}</div>
              </div>
              <div class="form-field">
                <label for="username">Full Name</label>
                <input type="text" name="fullName" id="fullName" v-model="fullName" />
                <div class="error">{{ !rules.fullName.test(fullName)?errors.fullName:""}}</div>
              </div>
              <div class="form-field">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" v-model="username" />
                <div class="error">{{ !rules.username.test(username)?errors.username:""}}</div>
              </div>
              <div class="form-field">
                <label for="password">Password</label>
                <input type="text" name="password" id="password" v-model="password" />
                <div class="error">{{ !rules.password.test(password)?errors.password:""}}</div>
              </div>
              <div class="form-field">
                <label for="c_password">Confirm Password</label>
                <input type="text" name="c_password" id="c_password" v-model="confirm_password" />
                <div
                  class="error"
                >{{password!==confirm_password||password===""?errors.confirm_password:""}}</div>
              </div>
              <div class="form-controls">
                <div class="button-link" @click="toggleTab">already have an account?</div>
                <div :class="['button signup',!isFormValid()?'disabled':'']" @click="generateOTP">
                  <div class="text" v-if="!loading">Next</div>
                  <div  v-if="loading">verifying</div>
                </div>
              </div>
            </form>
            <form action="#" v-if="signupStage==2">
                <div class="form-field" aria-required>
                  <label for="otp">OTP</label>
                  <div class="field-info">enter the 4 digit otp we've mailed you just now!</div>
                  <input type="text" name="otp" v-model="otp">
                  <div class="error" v-if="!rules.otp.test(otp)">{{errors.otp}}</div>
                </div>
                <div class="form-controls">
                  <div class="button back" @click="signupStage=1">Back</div>
                  <div class="button finish" :class="{disabled:!rules.otp.test(otp)}" @click="signup">
                    <div v-if="loading">signing up</div>
                    <div v-else>Finish</div>
                  </div>
                </div>
            </form>
          </div>
          <form key="signin" @submit.prevent="login" action="#" v-if="tab=='login'" ref="form">
            <div class="form-wrapper">
              <div class="form-title">
                <div class="title">LOGIN</div>
              </div>
              <div class="form-field">
                <input type="text" placeholder="username" name="username" id="username" v-model="username" />
                <div class="error">{{ !rules.username.test(username) && username.length ?errors.username:""}}</div>
              </div>
              <div class="form-field">
                <input type="password" placeholder="password" name="password" id="password" v-model="password" />
                <div class="error">{{ !rules.password.test(password) && password.length ?errors.password:""}}</div>
              </div>
              <div class="divider"></div>

              <div class="form-controls">
                <div class="forgot-link">
                  <router-link to="/resetpassword">forgot password?</router-link>
                </div>
                <div :class="['button signup',!isFormValid()?'disabled':'']" @click="login">
                    <div class="text" v-if="!loading">LOGIN</div>
                    <div v-if="loading">loggin in</div>
                </div>
              </div>
              <div class="controls">
                <div class="button-link" @click="toggleTab">new user?,signup here</div>
              </div>
            </div>
            <div class="signin-options">
              <div class="center title">OR SIGN IN WITH</div>
              <!-- <div class="center">SIGN IN WITH</div> -->
              <div class="form-field flex social-sign-in">
                <div class="button google">
                  <a href="http://localhost:3000/auth/linkedin/">Google</a>
                </div>
                <div class="button linkedin">
                  <a href="http://localhost:3000/auth/linkedin/">Linkedin</a>
                </div>
            </div>
            </div>
          </form>
        </transition>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import PlainNav from "../components/PlainNav";
import { mapMutations } from 'vuex';

export default {
  name: "Auth",
  components: {
    PlainNav
  },
  data: () => ({
    tab: "signup",
    email:"",
    fullName:"",
    username: "",
    password: "",
    confirm_password: "",
    otp:"",
    emailError:false,
    otpError:false,
    rules: {
      email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      fullName:/^(\w+\s?)+$/,
      username: /^[a-zA-Z0-9._]{4,}$/, ///[a-zA-z0-9_]{4,10}/
      password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      otp:/^\d\d\d\d$/
    },
    errors: {
      email:"enter a valid email address",
      fullName:"name should'nt contain any special characters or numbers!",
      username: "minimum 4 characters and only a-z,A-Z,_ are allowed",
      password:"should be minimum eight characters, at least one letter and one number",
      confirm_password: "password didn't match",
      otp:"otp should contains 4 digits only",
      emailError:"email is already in use"
    },
    loading:false, 
    error:false,
    signupStage:1
  }), 
  mounted(){
    let type=this.$route.params.type;
    if (['login','signup'].indexOf(type)!=-1){
         this.tab=type;
    }else{
      this.tab="login"
    }

  },
  methods: {
    ...mapMutations(['runLoader','stopLoader']),
    log() {
      console.log(this.security_question);
    },
    login() {
      if (!this.isFormValid()) {
        return;
      }
      let data = {
        username: this.username,
        password: this.password
      };
      this.loading=true;
      axios.post("/auth/signin",data).then(({data})=>{
              this.loading=false;
              this.error=false;
              localStorage.setItem("token",data.token);
              this.$router.replace('/');
      }).catch(()=>{
          this.loading=false;
          this.error=true;
      });
    },
    generateOTP() {
      if (!this.isFormValid()) {
        return;
      }

     //request otp
      this.loading=true;
      axios.post("/auth/getOTP",{email:this.email}).then(({data})=>{
        this.otpHash=data.otpHash;
        this.signupStage=2;
        this.loading=false;
        this.emailError=false;
      }).catch(()=>{
        this.loading=false;
        this.emailError=true;
      });

    },
    signup(){
      if(!this.isFormValid()  || !this.rules.otp.test(this.otp)){
        return;
      }
      let data = {
        username: this.username,
        password: this.password,
        fullName:this.fullName.trim(),
        email:this.email,
        otp:this.otp,
        otpHash:this.otpHash
      };
      this.loading=true;
      axios.post("/auth/signup",data).then(({data})=>{
          this.loading=false;
          this.error=false;
          this.otpError=false;
          localStorage.setItem("token",data.token);
          this.$router.replace("/");
      }).catch(()=>{
          this.loading=false;
          this.otpError=true;
          this.error=true;
      });
    },
    toggleTab() {
      this.tab = this.tab === "login" ? "signup" : "login";
      this.resetValues();
    },
    resetValues() {
      this.email="";
      this.fullName="";
      this.username = "";
      this.password = "";
      this.confirm_password = "";
    },
    isFormValid() {
      let username_password_test =
        this.rules.username.test(this.username) &&
        this.rules.password.test(this.password);
      if (this.tab === "login") {
        return username_password_test;
      } else {
        return (
          username_password_test &&
          this.password === this.confirm_password
        );
      }
    },
  },
  watch:{
    email(){
      this.emailError=false;
    },
    otp(){
      this.otpError=false;
    }
  },
  beforeRouteEnter(to,from,next){
    if(localStorage.getItem('token')){
     next("/");
    }else{
      next();
    }
  }
};
</script>

<style scoped>
section{
  min-height: 100vh;
  box-sizing: border-box;
  background: rgb(5, 5, 37);
}
.auth-container {
  /* background: blue; */
  display: flex;
  justify-content: center;
  padding: 1em;
}
.form-container{
  display: flex;
  flex: 1;
  justify-content: center;
}
.form-container .signup{
  background: white;
  padding: 1rem;
}
form {
  max-width: 400px;
  /* background: white; */
  flex: 1;
}
.form-wrapper{
  background: white;
  padding: 1em;
}
.signin-options{
  background: white;
  margin-top: 1rem;
  padding: 10px;
}


.form-field {
  display: flex;
  flex-direction: column;
  margin: 10px;
}
.form-field label {
  font-size: 1.2em;
  color: rgb(18, 25, 126);
  font-weight: bold;
  padding: 0.2em 0em;
}
.form-field input,
select {
  border: none;
  outline: none;
  padding: 10px 15px;
  font-size: 1em;
  background: rgb(225, 236, 250);
}
.form-field .error {
  color: rgb(226, 37, 37);
  font-size: 0.8em;
}
.field-info{
  color: gray;
}

.divider {
  width: 100%;
  height: 2px;
  background: rgb(233, 212, 212);
}
.form-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}
.form-controls .button{
  padding: 5px 1em;
  background: rgb(47, 47, 150);
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
}
.form-controls .button.back{
  background: rgb(246, 57, 57);
}

.form-controls .button.disabled {
  background: gray;
}
.form-controls .button.disabled {
  cursor: not-allowed;
}
.button-link {
  color: green;
  text-decoration: underline;
  cursor: pointer;
}
.form-controls .button.login {
  background: rgb(145, 146, 145);
}
.form-controls .button.signup {
  /* background: rgb(98, 97, 97); */
}
.form-controls .button:hover {
  filter: brightness(0.8);
}
.form-enter-active,
.form-leave-active {
  transition: opacity 0.5s ease-out;
}
.form-enter,
.form-leave-to {
  opacity: 0;
}
.form-title {
  display: flex;
  justify-content: center;
}
.form-title .title {
  font-size: 1.2em;
  font-weight: bold;
  position: relative;
}
.form-title .title::before,
.form-title .title::after {
  content: "";
  display: block;
  position: absolute;
  height: 2px;
  background: blue;
  width: 50px;
  top: 50%;
  margin: 0px 10px;
  transform: translateY(-50%);
}
.form-title .title::before {
  left: 100%;
}
.form-title .title::after {
  right: 100%;
}
.social-sign-in{
  margin-top: 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.center{
  text-align: center;
}
.button{
  font-size: 1.2em;
  padding: 0.3em 1em;
  color: white;
  cursor: pointer;
}
.button.google{
  background: rgb(245, 86, 86);
}
.button.linkedin{
  background: rgb(57, 133, 233);
}
a{
  color: white;
  text-decoration: none;
}
.forgot-link a{
  color: blue;
}
.forgot-link a:hover{
  text-decoration: underline;
}
.controls{
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>