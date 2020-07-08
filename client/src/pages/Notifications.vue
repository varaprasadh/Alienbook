<template>
  <section class="notifications">
    <div class="container">
      <div class="notif-list">
        <Notification v-for="(n,i) in notifications" :key="i" :notification="n"/>
         <div v-if="loading">
           <BottomLoadingBar/>
         </div>
         <div class="notifications-fallback" v-if="notifications.length==0">
           <div class="card">no nofications!</div>
         </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from "../components/Notification";
import { mapState, mapMutations } from 'vuex';
import Axios from 'axios';
import BottomLoadingBar from "../components/BottomLoadBar";

export default {
  name:"notifications",
  components:{
    Notification,
    BottomLoadingBar
  },
  data(){
    return ({
      loading:false,
      skip:0,
      completed:false
    })
  },
  computed:{
    ...mapState(['notifications'])
  },
  created(){
    if(this.notifications.length<=0){
      this.loadNotifications();
    }
  },
  mounted(){
    window.onscroll=()=>{
      let isbottomVisible=document.documentElement.scrollTop+window.innerHeight===document.documentElement.offsetHeight;
      if(isbottomVisible){
        this.loadNotifications();
      }
    }
  },
  methods:{
    ...mapMutations(['setNotifications']),
    loadNotifications(){
      if(this.loading || this.completed) return;
      this.loading=true;
      Axios.get("/notifications").then(({data})=>{
        this.setNotifications(data.data);
        this.loading=false;
        this.skip+=20;
        this.completed=data.completed;
      }).catch(()=>{
        this.loading=false;
      });
    }
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