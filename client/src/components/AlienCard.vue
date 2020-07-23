<template>
    <div class="alien-card">
        <div class="image">
            <img src="../assets/png/alien_black.png" alt="alien">
        </div>
        <router-link :to="'/profile/'+alien.username">
            <div class="meta">
                <div class="username">{{alien.username}}</div>
                <div class="fullName">{{alien.fullName}}</div>
            </div>
        </router-link>
        <div class="buttons">
            <div v-if="btnLoadingState"> 
                <div class="btn-loader">wait</div>
            </div>
            <div v-else>
              <div v-if="alien.isIam"></div>
              <div v-else>
                  <button v-if="alien.amIFollowing" class="btn following" @click="unfollow">Unfollow</button>
                  <button v-else class="btn notFollwing" @click="follow">Follow</button>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios';

export default {
  name:"alien-follow-card",
  props:["alien"],
  data:()=>({
   btnLoadingState:false
  }),
  methods:{
      follow(){
        this.btnLoadingState=true;
        Axios.post("/users/follow",{userId:this.alien.id}).then(({data})=>{
          console.log(data);
          this.btnLoadingState=false;
          this.alien.amIFollowing=true;
        }).catch(err=>{
          console.log(err);
          this.btnLoadingState=false;
        });
      },
      unfollow(){
          this.btnLoadingState=true;
         Axios.post("/users/unfollow",{userId:this.alien.id}).then(({data})=>{
          console.log(data);
          this.btnLoadingState=false;
          this.alien.amIFollowing=false;
        }).catch(err=>{
          console.log(err);
          this.btnLoadingState=false;
        });
      }
  }
  
}
</script>

<style scoped>
.alien-card{
  display: flex;
  align-items: center;
  background: white;
  margin: 10px;
  padding: 10px;
}
.alien-card .image{
  border: 2px solid rgb(187, 187, 187);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 5px;
  margin-right: 10px;
  background: rgb(246, 246, 246);
}
.alien-card .image img{
  margin: 10px;
  width: 50px;
}
.alien-card .meta .username{
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 5px;
}
.alien-card .meta .fullName{
  font-weight: bold;
  color: rgb(139, 136, 136);
}
.alien-card .buttons{
  margin-left: auto;
}
.alien-card .buttons .btn,.btn-loader{
  padding: 10px 20px;
  outline: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  letter-spacing: 1px;
  font-weight: bold;
  background: rgb(209, 206, 206);
}
.alien-card .buttons .btn.notFollwing{
   background: rgb(55, 22, 243);
   color: white;
}
.btn-loader{
    background: rgb(186, 207, 248);
    cursor:progress;
}
</style>