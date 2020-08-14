<template>
   <div class="edit-profile-container">
       <div class="bg-overlay-wrapper">
        <form class="card editprofile">
            <div class="form-label">Edit Profile</div>
                    <div class="input-wrapper image">
                    <div class="preview-container-wrapper">
                        <div class="preview-container" @click="openFileDailogue">
                            <input type="file" hidden ref="fileinput" @change="e=>avatar_file=e.target.files[0]">
                            <img class="profile-pic-preview" :src="avatar_url" alt="">
                            <div class="overlay">
                                <div class="icon-text">upload</div>
                            </div>
                        </div>
                    </div>
                </div>
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
                    <div class="action cancel" @click="$emit('close')">Cancel</div>
                    <div class="action save" @click="submit">Save</div>
                </div>
        </form>
       </div>
   </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Axios from 'axios';
const {mapState,mapMutations}= createNamespacedHelpers("user");
export default {
   name:"edit-profile",
   props:['show'],
   data(){
     return ({
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
       avatar_file:null
     })
   },
   computed:{
       ...mapState(['user']),
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
        },
        avatar_url(){
          return this.avatar_file && URL.createObjectURL(this.avatar_file) || require("../assets/avatar.png");
        }
   },
   methods:{
     ...mapMutations(['setUser']),
      submit(){
        if(this.usernameValid && this.fullnameValid){
          // let data={username:this.username.value,fullName:this.fullName.value};
          const formData=new FormData();
          formData.append("username",this.username.value);
          formData.append("fullName",this.fullName.value);
          formData.append("image",this.avatar_file);
          Axios.post("/users/profile",formData,{
            headers:{
               'Content-Type': 'application/json'
            }
          }).then(({data})=>{
            this.username.notAvailable=false;
            this.profileEditor=false;
            this.setUser(data.profile);
            this.stopgl_loader();
          }).catch(()=>{
            this.stopgl_loader();
            this.username.notAvailable=true;
          })
        }
      },
       openFileDailogue(){
        this.$refs.fileinput.click();
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
  },
  mounted(){
     this.username.value=this.user.username;
     this.fullName.value=this.user.fullName;
   },
}
</script>

<style scoped>

.bg-overlay-wrapper{
  position: absolute;
  height: 100%;
  width: 100%;
  top:0px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: animateBg 500ms linear 1 400ms;
  animation-fill-mode: forwards;
}
  @keyframes animateBg{
    to{
      background: rgba(37, 37, 37, 0.781);
    }
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

.fade-enter-active, .fade-leave-active{
  transition: all .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
  transform: translateY(-1000px);
}
.input-wrapper.image{
 
}
.preview-container-wrapper{
  display: flex;
  justify-content: center;
}
.preview-container{
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  width: 100px;
  height: 100px;
  cursor: pointer;
   border: 3px solid rgb(32, 216, 93);
   transition:all 200ms linear;

}
.preview-container:hover{
  border: 3px solid cyan;
}
.preview-container:hover .overlay .icon-text{
  font-size: 1.2em;
}

.profile-pic-preview{
  width: 100px;
  height: 100px;
}

.preview-container .overlay{
  position: absolute;
  background: rgba(0, 0, 0, 0.137);
  width: 100%;
  height: 100%;
  top:0px;
  left: 0px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-container .overlay .icon-text{
  font-weight: bold;
  color: white;
  transition:all 200ms linear;
}
</style>