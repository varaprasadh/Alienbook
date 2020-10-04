<template>
  <section class="nav-wrapper">
     <nav class="main-nav">
       <div class="nav-container">
           <div class="nav-group">
               <div class="nav-item-logo">
                   <router-link class="nav-link" to="/">
                      <img src="../assets/png/logo_white.png" alt="alienbook-logo">
                   </router-link>
               </div>
           </div>
           <div class="nav-group sm-bottom">
               <div class="nav-item write-post" @click="openEditor({})">
                   <div class="icon">
                     <Plus/>
                   </div>
               </div>
                <router-link class="nav-item home nav-link" to="/" :class="{active:currentPage==='/'}">
                      <div class="icon">
                        <Home v-if="currentPage==='/'"/>
                        <HomeOutline v-else/>
                      </div>
                      <!-- <div class="label">Home</div>  -->
                </router-link>
                <router-link class="nav-item find Aliens nav-link" to="/aliens" :class="{active:currentPage==='/aliens'}">
                   <div class="icon">
                      <People v-if="currentPage==='/aliens'"/>
                      <PeopleOutline v-else/>                       
                   </div>
                   <!-- <div class="label">Explore</div> -->
                </router-link>
               <router-link class="nav-item notifications nav-link" to="/notifications"  :class="{active:currentPage==='/notifications'}">
                    <div class="icon">
                        <div class="badge" v-if="getUnreadNotifCount>0">{{getUnreadNotifCount}}</div>
                        <Bell v-if="currentPage==='/notifications'"/>
                        <BellOffOutline v-else/>
                    </div>
                    <!-- <div class="label">Notifications</div> -->
                </router-link>
               <router-link class="nav-item settings nav-link" to="/settings"  :class="{active:currentPage==='/settings'}">
                    <div class="icon">
                       <Wrench v-if="currentPage==='/settings'"/>
                       <WrenchOutline v-else/>
                    </div>
                    <!-- <div class="label">Settings</div> -->
               </router-link>
           </div>
       </div>
     </nav>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Home from "vue-material-design-icons/Home";
import HomeOutline from "vue-material-design-icons/HomeOutline";

import People from "vue-material-design-icons/AccountMultiple";
import PeopleOutline from "vue-material-design-icons/AccountMultipleOutline";

import Bell from "vue-material-design-icons/Bell";
import BellOffOutline from "vue-material-design-icons/BellOutline";

import Wrench from "vue-material-design-icons/Wrench";
import WrenchOutline from "vue-material-design-icons/WrenchOutline";

import Plus from "vue-material-design-icons/Plus";


const {mapGetters:mapNotificationGetters}= createNamespacedHelpers("notificationCentre")
const {mapState:mapUserState}= createNamespacedHelpers("user")
const {mapMutations:mapEditorMutations }=createNamespacedHelpers("editor");

export default {
  name:"app-nav",
  components:{
    Home,HomeOutline,
    People,PeopleOutline,
    Bell,BellOffOutline,
    Wrench,WrenchOutline,
    Plus
  },
  data:()=>({
    profileMenu:false
  }),
  computed:{
    ...mapUserState(['user']),
    ...mapNotificationGetters(['getUnreadNotifCount']),
    currentPage(){
      return this.$route.path;
    }
  },
  methods:{
    ...mapEditorMutations(['openEditor'])
  }
}

</script>

<style>


.svg-icon {
  width: 2em;
  height: 2em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: #ffffff;
}

.svg-icon circle {
  stroke: #ffffff;
  stroke-width:1;
}
a{
    display: block;
    text-decoration: none;
    color:inherit;
}
.main-nav{
    padding: 5px;
    background: black;
    display: flex;
    align-items: center;
    color: white;
}
.nav-container{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    max-width: 700px;
    margin: 0px auto;
}
.main-nav .nav-group{
    display: flex;
    align-items: center;
}
.nav-item{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    position: relative;
    flex: 1;
}


.nav-item.write-post svg path{
  stroke-width: 10px;
}


.nav-item-logo img{
    width: 100px;
    margin: 0px 10px;
}
.nav-item .icon img{
    width: 25px;
}
.nav-item .icon{
    position: relative;
    padding: 5px;
}

.icon .badge{
    position: absolute;
    top:0%;
    right:0%;
    width:15px;
    height:15px;
    background: tomato;
    border-radius: 50%;
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.profile-option-menu{
  position: absolute;
  z-index: 2;
  top:100%;
  right: 0%;
}
.menu{
  color: rgb(0, 0, 0);
  z-index: inherit;
  background: white;
  border-radius: 2px;
  overflow: hidden;

}


@media screen and (max-width:600px) {
  .sm-bottom{
    position: fixed;
    bottom: 0px;
    width: 100%;
    right: 0px;
    left: 0px;
    z-index: 99;
    background: black;
    display: flex;
    justify-content: space-around;
  }
  .sm-bottom .nav-item{
    flex: 1;
  }
  .sm-bottom .nav-item.home{
    order: 1;
  }
 
  .sm-bottom .nav-item.write-post{
    order: 3;
    width: 50px;
    height: 50px;
    max-width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid white;
  }
  .sm-bottom .nav-item.Aliens{
    order: 2;
  }

  .sm-bottom .nav-item.settings{
     order: 5
  }
  .sm-bottom .nav-item.notifications{
     order: 4;
  }
}
</style>