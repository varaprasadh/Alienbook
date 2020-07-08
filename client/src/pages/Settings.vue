<template>
  <section class="settings">
    <div>
      <GLHLoader/>
      <div class="container">
        <div class="settings-wrapper">
          <div class="setting" @click="$router.push(`/profile/${user.username}`)">Profile</div>
          <div class="setting" @click="profileEditor=true">Edit Profile</div>
          <div class="setting" @click="changePassword=true">Change Password</div>
          <div class="setting warning" @click="logout">Logout</div>
        </div>
      </div>
    </div>
    <!-- edit profile form -->
    <div class="bg-overlay-wrapper" v-if="profileEditor || changePassword || logoutDailogue">
      <form class="card editprofile"  v-if="profileEditor" ref="editprofileform">
        <div class="form-label">Edit Profile</div>
        <div class="input-wrapper">
          <label for="fullname">Full Name</label>
          <input type="text"  id="fullname" v-model="fullName.value"/>
          <div class="errors" v-if="!fullnameValid">
            <div class="error">{{fullName.error}}</div>
          </div>
        </div>
        <div class="input-wrapper">
          <label for="fullname">username</label>
          <input type="text"  id="username" v-model="username.value"/>
          <div class="errors">
            <div class="error" v-if="username.notAvailable">username not available</div>
            <div class="error" v-if="!usernameValid">{{username.error}}</div>
          </div>
        </div>
        <div class="actions">
          <div class="action cancel" @click="profileEditor=false">Cancel</div>
          <div class="action save" @click="submit">Save</div>
        </div>
      </form>
      <form class="card change-password" v-if="changePassword" ref="changepasswordform">
        <div class="form-label">Change Password</div>
        <div class="input-wrapper">
          <label for="oldPassword">Old Password</label>
          <div class="input">
            <input type="password"  id="fullname" v-model="oldPassword"/>
            <div class="eye"></div>
          </div>
          <div class="errors" v-if="!isoldPasswordValid">
            <div class="error">should be minimum eight characters, at least one letter and one number</div>
          </div>
        </div>
        <div class="input-wrapper">
          <label for="newPassword">New Password</label>
          <div class="input">
            <input type="password"  id="newPassword" v-model="newPassword"/>
            <div class="eye"></div>
          </div>
          <div class="errors" v-if="!isnewPasswordValid">
            <div class="error">should be minimum eight characters, at least one letter and one number</div>
          </div>
        </div>
        <div class="input-wrapper">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input">
            <input type="password"  id="confirmPassword" v-model="confirmPassword"/>
            <div class="eye"></div>
          </div>
          <div class="errors" v-if="!isconfirmPasswordValid">
            <div class="error">password does'nt match!</div>
          </div>
        </div>
        <div class="actions">
          <div class="action cancel" @click="changePassword=false">Cancel</div>
          <div class="action save" @click="savePassword">Save</div>
        </div>
      </form>
    </div>

  </section>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import Axios from 'axios';
import GLHLoader from "../components/GLHLoader";

export default {
   name:"settings",
   components:{
     GLHLoader
   },
   data(){
     return ({
       profileEditor:false,
       changePassword:false,
       logoutDailogue:false,
       username:{
         value:"",
         regex:/^[a-zA-Z0-9._]{4,}$/,
         error:"username should only have A-Z,a-z,0-9,_",
         notAvailable:false
       },
       fullName:{
         value:"",
         error:"full name can't be empty"
       },
       oldPassword:"",
       newPassword:"",
       confirmPassword:"",
       rules:{
         password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
       }
     })
   },
   mounted(){
     this.username.value=this.user.username;
     this.fullName.value=this.user.fullName;
   },
   methods:{
      ...mapMutations(['rungl_loader',"stopgl_loader",'setuser']),
      ...mapMutations({clearStore:state=>state.logout}),
      submit(){
        if(this.usernameValid && this.fullnameValid){
          this.rungl_loader();
          let data={username:this.username.value,fullName:this.fullName.value};
          Axios.post("/users/profile",data).then(({data})=>{
            this.username.notAvailable=false;
            this.profileEditor=false;
            this.setuser(data.profile);
            this.stopgl_loader();
          }).catch(()=>{
            this.stopgl_loader();
            this.username.notAvailable=true;
          })
        }
      },
      savePassword(){
        if(this.isnewPasswordValid && this.isoldPasswordValid && this.isconfirmPasswordValid){
              //
              this.rungl_loader();
              let data={current_password:this.oldPassword,new_password:this.newPassword}
              Axios.post("/users/profile/changepwd",data).then(({data})=>{
                console.log(data);
                this.stopgl_loader();
                this.resetPasswordForm();
                this.changePassword=false;
              }).catch(()=>{
                this.stopgl_loader();
              })
        }    
      },
      resetPasswordForm(){
        this.oldPassword="";
        this.newPassword="";
        this.confirmPassword="";
      },
      logout(){
        localStorage.clear();
        this.clearStore();
        this.$router.replace("/login");
      }
   },
   computed:{
     ...mapState(['user','appLoadingState']),
     usernameValid(){ 
       return this.username.regex.test(this.username.value);
     },
     fullnameValid(){
       return this.fullName.value.trim()!=="";
     },
     isnewPasswordValid(){
       return this.rules.password.test(this.newPassword)
     },
     isoldPasswordValid(){
       return this.rules.password.test(this.oldPassword)
     },
     isconfirmPasswordValid(){
       return this.rules.password.test(this.confirmPassword) && this.confirmPassword===this.newPassword;
     }
   },
  watch:{
    "username.value"(){
      this.username.notAvailable=false;
    },
    user(){
      this.username.value=this.user.username;
      this.fullName.value=this.user.fullName;
    }
  }
}
</script>

<style scoped>
 .settings{
   display: flex;
   flex-direction: column;
 }
  .container{
   max-width: 600px;
   margin:1rem auto;
 }
 .label{
   font-size: 2rem;
   font-weight: bold;
 }
 .setting{
   padding: 10px;
   background: white;
   border-bottom: 1px solid rgb(180, 175, 175);
   cursor: pointer;
 }
  .setting:hover{
    background: rgb(235, 231, 231);
  }
 .setting.warning{
   color: rgb(184, 56, 33);
 }
 .backbutton{
   display: flex;
   margin-right: 10px;
   font-size: 1.2rem;
   color: rgb(214, 208, 208);
   cursor: pointer;
 }

.bg-overlay-wrapper{
  position: absolute;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.445);
  display: flex;
  justify-content: center;
  align-items: center;
}
.card{
  background: white;
  padding: 1rem;
  width: 300px;
}
.card label{
  font-size: 1rem;
  color: rgb(56, 54, 54);
  padding: 5px 0px;
}
.input-wrapper input{
  font-size: 1.2rem;
  padding: 2px 10px;
  border: none;
  outline: none;
  border-bottom: 2px solid rgb(188, 188, 229);
}
.input-wrapper{
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.actions{
  display:flex;
  justify-content: space-around;
  margin: 10px 0px 0px;
}
.actions .action{
  color: white;
  font-size: 1rem;
  padding: 5px 20px;
  border-radius: 5px;
  cursor: pointer;
}
.input-wrapper .input{
  display: flex;
  align-items: center;
}
.input-wrapper .input input{
  flex: 1;
}
.input-wrapper .input .eye{
  height: 15px;
  width: 15px;
  /* background: rgb(117, 159, 236); */
  border-radius: 50%;
  cursor: pointer;
}
.input-wrapper .input .eye:hover{
  background: red;
}
.actions .action:hover{
  transform: rotate(-5deg);
}
.action.cancel{
  background: tomato;
}
.action.save{
  background: rgb(7, 158, 78);
}
.error{
  color: rgb(252, 40, 2);
  font-size: 0.8rem;
}

.form-label{
  text-align: center;
  font-weight: bold;
}
</style>