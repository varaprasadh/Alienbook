<template>
  <section class="settings">
    <div>
      <div class="container">
        <div class="settings-wrapper">
          <div class="setting" @click="$router.push(`/profile/${user.username}`)">Profile</div>
          <div class="setting" @click="editProfile=true">Edit Profile</div>
          <div class="setting" @click="$router.push('/policy')">Privacy Policy</div>
          <div class="setting warning">Logout</div>
        </div>
      </div>
      <EditProfile v-if="editProfile" @close="()=>editProfile=false"/>
    </div>
  </section>
</template>

<script>
import EditProfile from "../components/EditProfile";
export default {
   name:"settings",
   components:{
     EditProfile
   },
   data(){
     return ({
       editProfile:true,
       logoutDailogue:false,
     })
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


</style>