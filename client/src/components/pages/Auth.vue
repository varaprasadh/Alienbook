<template>
  <section>
    <div class="auth-container">
      <div class="form-container">
        <transition name="form" :duration="{ enter:500, leave: 500 }" mode="out-in">
          <form key="signup" @submit.prevent="signup" action="#" v-if="tab=='signup'" ref="form">
            <div class="form-title">
              <div class="title">SIGNUP</div>
            </div>
            <div class="form-field">
              <label for="username">Email</label>
              <input type="email" name="email" id="email" v-model="email" />
              <div class="error">{{ !rules.email.test(email)?errors.email:""}}</div>
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
            <div class="divider"></div>
            <div class="form-controls">
              <div class="button-link" @click="toggleTab">already have an account?</div>
              <div :class="['button signup',!isFormValid()?'disabled':'']" @click="signup">
                <div class="text" v-if="!loading">SIGNUP</div>
                <div  v-if="loading">Loading...</div>
              </div>
            </div>
          </form>
          <form key="signin" @submit.prevent="login" action="#" v-if="tab=='login'" ref="form">
            <div class="form-title">
              <div class="title">LOGIN</div>
            </div>
            <div class="form-field">
              <label for="username">username</label>
              <input type="text" name="username" id="username" v-model="username" />
              <div class="error">{{ !rules.username.test(username)?errors.username:""}}</div>
            </div>
            <div class="form-field">
              <label for="password">password</label>
              <input type="text" name="password" id="password" v-model="password" />
              <div class="error">{{ !rules.password.test(password)?errors.password:""}}</div>
            </div>
            <div class="divider"></div>

            <div class="form-controls">
              <div class="button-link" @click="toggleTab">new user?,signup here</div>
              <div :class="['button signup',!isFormValid()?'disabled':'']" @click="login">
                  <div class="text" v-if="!loading">LOGIN</div>
                  <div v-if="loading">Loading...</div>
               </div>
            </div>
            <div class="center">OR</div>
            <!-- <div class="center">SIGN IN WITH</div> -->
            <div class="form-field flex social-sign-in">
              <!-- <div class="button google">
                  Google
              </div> -->
              <div class="button linkedin">
                 <a href="http://localhost:3000/auth/linkedin/">Linkedin</a>
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

export default {
  name: "Auth",
  components: {},
  data: () => ({
    tab: "signup",
    questions: [
      "what is your pet name?",
      "who is your best friend?",
      "who is your favourite cricketer?",
      "what is your favourite dish?",
      "who inspires you the most?",
      "In what town or city were you born?",
      "What primary school did you attend?"
    ],
    email:"",
    fullName:"",
    username: "",
    password: "",
    confirm_password: "",
    security_answer: "",
    security_question: "what is your pet name?",
    rules: {
      email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      fullName:/^[a-zA-Z]+$/,
      username: /^[a-zA-Z0-9._]{4,}$/, ///[a-zA-z0-9_]{4,10}/
      password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      security_answer: /\w+/
    },
    errors: {
      email:"enter a valid email address",
      fullName:"name should'nt contain any special characters or numbers!",
      username: "minimum 4 characters and only a-z,A-Z,_ are allowed",
      password:"should be minimum eight characters, at least one letter and one number",
      confirm_password: "password didn't match",
      security_answer:"fill your answer,it will be helpful in account recovery if you forgot password"
    },
    loading:false,
    error:false
  }), 
  mounted(){
    let type=this.$route.params.type;
  
    if (['login','signup'].indexOf(type)!=-1){
         this.tab=type;
    }
  },
  methods: {
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
          if(data.success==true){
              //redirect to home page
              localStorage.setItem("token",data.token);
              this.$router.replace('/');
          }
      }).catch(()=>{
          this.loading=false;
          this.error=true;
      });
    },
    signup() {
      if (!this.isFormValid()) {
        return;
      }
      let data = {
        username: this.username,
        password: this.password,
        security_question: this.security_question,
        security_answer: this.security_answer
      };
        axios.post("/auth/signup",data).then(({data})=>{
          this.loading=false;
          this.error=false;
          if(data.success==true){
              //redirect to home page
              console.log("procees to tag selection");
              localStorage.setItem("token",data.token);
              this.$router.replace("/auth/tags");
          }
      }).catch(()=>{
          this.loading=false;
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
      this.security_answer = "";
      this.security_question = "what is your pet name?";
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
          this.password === this.confirm_password &&
          this.rules.security_answer.test(this.security_answer)
        );
      }
    }
  }
};
</script>

<style scoped>
section{
  min-height: 100vh;
  box-sizing: border-box;
  background: rgb(27, 27, 211);
}
.auth-container {
  /* background: blue; */
  display: flex;
  justify-content: center;
  padding: 1em;
}
form {
  padding: 1em;
  width: 400px;
  background: white;
}
.form-field {
  display: flex;
  flex-direction: column;
  margin: 10px;
}
.form-field label {
  font-size: 1.2em;
  color: rgb(30, 36, 117);
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
  color: rgb(245, 115, 115);
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
  padding: 0.5em 1em;
  background: rgb(47, 47, 150);
  font-weight: bold;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
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
  margin-right: 1em;
}
.form-controls .button.login {
  background: rgb(92, 98, 95);
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
  background: rgb(241, 49, 49);
}
.button.linkedin{
  background: rgb(57, 133, 233);
}
a{
  color: white;
  text-decoration: none;
}
</style>