<template>
  <div class="likeinfo-wrapper">
    <div class="wrapper">
        <div class="reaction">
            <img v-if="reaction.type==='LIKE'" src="../assets/reactions/like.svg"  alt="like" >
            <img v-if="reaction.type==='LOVE'" src="../assets/reactions/love.svg"  alt="love" >
            <img v-if="reaction.type==='CARE'" src="../assets/reactions/care.svg"  alt="care" >
            <img v-if="reaction.type==='HAHA'" src="../assets/reactions/haha.svg"  alt="haha" >
            <img v-if="reaction.type==='WOW'" src="../assets/reactions/wow.svg"   alt="wow" >
            <img v-if="reaction.type==='ANGRY'" src="../assets/reactions/angry.svg" alt="angry" >
        </div>
        <div class="info">
            <div class="username">{{reaction.username}}</div>
        </div>
        <div class="time">{{time}}</div>
    </div>
    <div class="devider"></div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name:"likeInfo",
  props:['reaction'],
  computed:{
      time(){
          return moment(this.reaction.timestamp).fromNow();
      }
  }
}

</script>

<style scoped>
 .wrapper{
     background: rgb(255, 255, 255);
     height: 20px;
     padding: 1em;
     display: flex;
     align-items: center;
 }
 .devider{
     height: 1px;
     background: rgb(219, 217, 217);
     width: 90%;
     margin: auto;
 }
 .reaction img{
    width: 25px;
 }
 .info{
     margin-left:10px; 
 }
 .time{
     margin-left: auto;
     font-size: 0.8em;
 }
</style>