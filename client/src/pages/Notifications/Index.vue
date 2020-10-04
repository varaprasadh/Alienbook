<template>
  <section class="notifications">
    <div class="container">
      <div class="notif-list">
        <Notification v-for="(n,i) in notifications" :key="i" :notification="n"/>
         <div v-if="loading">
           <BottomLoadingBar/>
         </div>
         <div class="notifications-fallback" v-if="notifications.length==0 && !loading">
           <div class="card">no nofications!</div>
         </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from "./components/Notification";
import { createNamespacedHelpers } from 'vuex';
import BottomLoadingBar from "../../components/BottomLoadBar";

const {mapState,mapActions} =createNamespacedHelpers('notificationCentre');

export default {
  name:"notifications",
  components:{
    Notification,
    BottomLoadingBar
  },
  data(){
    return ({
    })
  },
  computed:{
    ...mapState({
      notifications:state=>state.notifications,
      loading:state=>state.loading
    })
  },
  created(){
    if(this.notifications.length<=0){
      this.loadNotifications();
    }
  },
  mounted(){
    this.skip=this.notifications.length;
    window.onscroll=()=>{
      let isbottomVisible=document.documentElement.scrollTop+window.innerHeight===document.documentElement.offsetHeight;
      if(isbottomVisible){
        this.loadNotifications();
      }
    }
  },
  methods:{
    ...mapActions(['loadNotifications'])
  }
}
</script>

<style scoped>
.container{
   max-width: 600px;
   margin:1rem auto;
 }
.notifications-fallback{
  text-align: center;
  margin: 10px;
}
.notifications-fallback .card{
  padding: 1em;
  background: white;
}
</style>