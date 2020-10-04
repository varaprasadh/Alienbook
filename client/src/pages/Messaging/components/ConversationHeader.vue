<template>
    <div class="converation-header">
        <div class="nav">
            <div class="nav action back icon" @click="$emit('back')" v-if="backNav">
                <ArrowLeft/>
            </div>
        </div>
        <div class="avatar">
            <img src="./icons/Avatar.png" alt="avatar">
        </div>
        <div class="conversation-header-info">
            <div class="username">John doe</div>
            <div class="last-seen">aug 3rd</div>
        </div>
        <div class="conversation-actions">
            <div class="icon">
                <!-- <MenuIcon/> -->
            </div>
        </div>
    </div>
</template>

<script>
import ArrowLeft from "vue-material-design-icons/ArrowLeft";

export default {
   name:"conversation-header",
   props:{
       backNav:{
           type:Boolean,
           default:false
       }
   },
   components:{
       ArrowLeft
   }
}
</script>

<style scoped>
 .converation-header{
       display: flex;
       padding: 0.5em;
       align-items: center;
       border-bottom: 1px solid rgb(187, 182, 182);
   }
   .converation-header .avatar{
       width: 50px;
       height: 50px;
   }
   .converation-header .avatar img{
       width: 100%;
       height: 100%;
   }
   .conversation-header-info{
       flex: 1;
       padding-left: 10px;
   }
  .conversation-header-info .username{
      font-weight: bold;
      font-size: 1.2em;
 }
.nav{
    margin-right: 0.2em;
}
 .nav.action{
     padding: 0.2em;
     width: 30px;
     height: 30px;
     border-radius: 50%;
     display: flex;
     justify-content: center;
     align-items: center;
 }
 .thread-enter .nav.action.back.icon ,
 .thread-leave-to .nav.action.back.icon
 {
    transform: rotate(360deg);
}
.thread-enter-to .nav.action.back.icon
{
    transform: rotate(0deg);
}
.thread-enter-active .nav.action.back.icon
{
    transition: all 300ms;
}

</style>