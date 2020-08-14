<template>
  <div class="bg-overlay" @click="$emit('onclose')">
     <div class="container-wrapper" @click.stop>
         <div class="list">
            <div class="header">
               <div class="text">likes</div>
               <div class="close-btn" @click="$emit('onclose')">x</div>
            </div>
            <LikeInfo v-for="(reaction,i) in reactions" :reaction="reaction" :key="400+i" />
            <div class="loader" v-if="loading">
              <HorizontalLoader/>
            </div>
            <div class="observer-target" ref="obsverTarget"></div>
            <div class="fallback card" v-if="reactions.length<=0 && !loading">
              <div class="text">be the first one to like!</div>
            </div>
         </div>
     </div>
  </div>
</template>

<script>
import LikeInfo from "./LikeInfo";
import Axios from 'axios';
import HorizontalLoader from "./BottomLoadBar";

export default {
  name:"likeViewer",
  props:['post_id','parent_id'],
  components:{
      LikeInfo,HorizontalLoader
  },
  data(){
    return({
      reactions:[],
      skip:0,
      completed:false,
      loading:false,
      observer:null
    })
  },
  created(){
    this.loadReactions();
  },
  mounted(){
    this.observer=new IntersectionObserver(([entry])=>{
         if(entry.isIntersecting){
           this.loadReactions();
         }
    },{threshold:1});
    this.observer.observe(this.$refs.obsverTarget);
  },
  methods:{
    loadReactions(){
      if(this.loading || this.completed){
        return;
      }
      this.loading=true;
      Axios.get(`/post/likes`,{params:{post_id:this.post_id,parent_id:this.parent_id,kip:this.skip}}).then(({data})=>{
        this.reactions.push(...data.reactions);
        this.completed=data.completed;
        this.skip+=20;
      }).catch(err=>{
        console.log(err);
      }).finally(()=>{
        this.loading=false;
      })
    }
  }
}
</script>

<style scoped>
.bg-overlay{
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 99;
    top:0px;
    left: 0px;
    display: flex;
    align-items: center;
    animation: bganimate 500ms linear 1 300ms;
    animation-fill-mode: forwards;
}
@keyframes bganimate{
    to{
         background: rgba(34, 34, 34, 0.657);
    }
}
.pad{
  height: 500px;
  background: blue;
}
.observer-target{
  height: 10px;
  margin-bottom: 10px;
}
.container-wrapper{
  flex: 1;
  max-width: 500px;
  margin: 10px auto;
  height: 400px;
  padding: 1em;
}
.list{
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 5px;
    box-sizing: border-box;
    /* padding: 10px; */
}
.list{
    overflow-y: scroll;
}
.list .header{
    font-weight: bold;
    font-size: 1.2em;
    position: sticky;
    top:0px;
    background: white;
    padding: 1em 1em 0em;
    display: flex;
}
.close-btn{
    margin-left: auto;
    cursor: pointer;
}
.likes-enter-active, .likes-leave-active{
  transition: all 300ms ease-in-out;
}
.likes-enter, .likes-leave-to{
  opacity: 0;
  transform: translateY(200px);
}
.fallback.card{
  padding: 1em;
  border: 1px solid rgb(192, 192, 192);
  margin:10px;
}
</style>