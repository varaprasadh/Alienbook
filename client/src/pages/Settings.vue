<template>
  <section class="settings">
    <div>
      <Header label="Settings">
        <div class="backbutton">
            <div class="icon">Back</div>
        </div>
      </Header>
      <div class="container">
        <div class="settings-wrapper">
          <div class="setting" @click="profileEditor=true">Edit Profile</div>
          <div class="setting">Change Password</div>
          <div class="setting warning">Logout</div>
        </div>
      </div>
    </div>
    <div class="editprofile-wrapper" v-if="profileEditor">
      <div class="editprofile">
        <div class="input-wrapper">
          <label for="fullname">Full Name</label>
          <input type="text"  id="fullname"/>
          <div class="errors">
            <div class="error" v-for="(err,i) in fullName.errors" :key="i">{{err}}</div>
          </div>
        </div>
        <div class="input-wrapper">
          <label for="fullname">username</label>
          <input type="text"  id="username"/>
          <div class="errors">
            <div class="error" v-for="(err,i) in username.errors" :key="i">{{err}}</div>
          </div>
        </div>
        <div class="actions">
          <div class="action cancel">Cancel</div>
          <div class="action save">Save</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from "../components/Header";

export default {
   name:"settings",
   components:{
     Header
   },
   data(){
     return ({
       profileEditor:true,
       username:{
         value:"",
         errors:[]
       },
       fullName:{
         value:"",
         errors:[]
       }
     })
   }
}
</script>

<style scoped>
 .settings{
   position: absolute;
   width: 100%;
   height: 100%;
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

.editprofile-wrapper{
  position: absolute;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.445);
  display: flex;
  justify-content: center;
  align-items: center;
}
.editprofile{
  background: white;
  padding: 1rem;
  max-width: 300px;
}
.editprofile label{
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
}
</style>