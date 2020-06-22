<template>
  <section class="home">
    <AppNavBar/>
    <router-view></router-view>
  </section>
</template>

<script>
// import Logo from "../Logo.vue";
// import Feed from "../Feed.vue";
// import Saved from "../Saved.vue";
// import Editor from "../Editor.vue";
import { mapMutations ,mapActions} from 'vuex';
import AppNavBar from "../AppNavBar";

export default {
   name:"Home",
   components:{
    // Logo,Feed,Saved,Editor,
    AppNavBar
   },
   data:()=>({
      tab:"",
      rightNav:false,
      EditorOpen:false
   }),
   methods:{
       ...mapMutations({clearStore:state=>state.logout}),
        ...mapActions(['loadUserInfo']),
       logout(){
           this.clearStore();
           localStorage.clear();
           this.$router.replace("/auth/switch/login");
       }
   },
   created(){
         this.loadUserInfo();
   },
   mounted(){
       this.tab= this.$store.lastOpenedTab || 'feed';
   },
   beforeDestroy(){
      this.$store.lastOpenedTab=this.tab;
   }
}
</script>

<style scoped>


</style>