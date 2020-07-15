<template>
  <div class="bg-overlay" @click="$emit('onclose')">
     <div class="container-wrapper" @click.stop>
         <div class="list">
            <div class="header">
               <div class="text">likes</div>
               <div class="close-btn" @click="$emit('onclose')">x</div>
            </div>
            <LikeInfo v-for="i in Array(10)" :key="i"/>
            <LikeInfo v-for="i in Array(10)" :key="i"/>
            <LikeInfo v-for="i in Array(10)" :key="i"/>
         </div>
     </div>
  </div>
</template>

<script>
import LikeInfo from "./LikeInfo";

export default {
  name:"likeViewer",
  props:['postid'],
  components:{
      LikeInfo
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

</style>