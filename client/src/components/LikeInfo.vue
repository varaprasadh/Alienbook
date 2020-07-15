<template>
  <div class="likeinfo-wrapper">
    <div class="wrapper">
        <div class="reaction">
            <img src="../assets/like.svg" alt="">
        </div>
        <div class="info">
            <div class="username">varaprasadh</div>
        </div>
        <div class="time">2 hours ago</div>
    </div>
    <div class="devider"></div>
  </div>
</template>

<script>
export default {
  name:"likeInfo"
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