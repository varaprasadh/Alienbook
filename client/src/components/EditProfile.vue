<template>
   <div class="edit-profile-container">
       <div class="bg-overlay-wrapper">
        <form class="card editprofile">
            <div class="form-label">Edit Profile</div>
                    <div class="input-wrapper image">
                    <div class="preview-container-wrapper">
                        <div class="preview-container">
                            <input type="file" hidden ref="fileinput" @change="upload">
                            <img class="profile-pic-preview" :src="avatar_url" alt="">
                        </div>
                        <div class="overlay">
                            <div class="icon" v-if="uploading">
                              <Spinner/>
                            </div>
                            <div class="icon" v-else @click="openFileDailogue">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330"><path d="M325.607 84.394l-80-80c-5.857-5.858-15.355-5.858-21.213 0l-220 220A15 15 0 000 235v80c0 8.284 6.716 15 15 15h80a15 15 0 0010.606-4.394l220-220c5.859-5.857 5.859-15.354.001-21.212zM88.787 300H30v-58.787l135-135L223.787 165l-135 135zM245 143.787L186.213 85 235 36.214 293.787 95 245 143.787z"/></svg>
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
                    <div class="action cancel" @click="$emit('close')">
                      <span>Close</span>
                    </div>
                    <div class="action save" @click="submit">
                        <Spinner v-if="loading" />
                        <span v-else>Save</span>
                    </div>
                </div>
        </form>
       </div>
   </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Axios from 'axios';
import Spinner from "./Spinner";

const {mapState,mapMutations}= createNamespacedHelpers("user");
export default {
   name:"edit-profile",
   props:['show'],
   components:{
     Spinner,
     
   },
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
       uploading:false,
       loading:false
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
        avatar_url(){
          return this.user.profile_pic_url;
          // return this.avatar_file && URL.createObjectURL(this.avatar_file) || null;
        }
   },
   methods:{
     ...mapMutations(['setUser']),
      submit(){
        if(!this.usernameValid || !this.fullnameValid ||this.loading){
          return;
        }
          let data={username:this.username.value,fullName:this.fullName.value};
          Axios.post("/users/profile",data).then(({data})=>{
            this.username.notAvailable=false;
            this.setUser(data.profile);
            this.loading=false;
            this.$emit('close');
          }).catch(()=>{
            this.username.notAvailable=true;
            this.loading=false;
          })
      },
       openFileDailogue(){
        this.$refs.fileinput.click();
      },
      upload(e){
        const file=e.target.files[0];
        let formData=new FormData();
        formData.append("image",file);
        this.uploading=true;
        Axios.post("/users/profile/image",formData).then(({data})=>{
           console.log(data);
           this.user.profile_pic_url=data.url;
           this.uploading=false;
        }).catch(()=>{
           this.uploading=false;
        })
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
  animation: animateBg 200ms linear 1 100ms;
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
  display: flex;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  padding: 0.5em 1em;
  cursor: pointer;
}
.input-wrapper .input{
  display: flex;
  align-items: center;
}
.input-wrapper .input input{
  flex: 1;
}

.action.cancel{
  color: tomato;
}
.action.save{
  color: rgb(7, 158, 78);
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

.preview-container-wrapper{
  width: 100px;
  margin:auto;
  position: relative;
}
.preview-container{
  border-radius: 50%;
  overflow: hidden;
  width: 100px;
  height: 100px;
  border: 3px solid rgb(32, 216, 93);
  transition:all 200ms linear;
  box-sizing: border-box;
}
.preview-container:hover{
  border: 3px solid cyan;
}

.profile-pic-preview{
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.preview-container-wrapper .overlay{
  position: absolute;
  top:70%;
  left:70%;
  z-index: 2;
}
 .overlay .icon svg{
    width: 1rem;
    height: 1rem;
 }
 .overlay .icon{
    background: rgb(255, 255, 255);
    border: 2px solid  rgb(32, 216, 93);
    padding: 5px;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    transition:all 200ms linear;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>