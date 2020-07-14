<template>
  <section class="container">
    <PlainNav/>
    <div class="wrapper">
      <div class="image">
        <img src="../assets/404.svg" alt="404">
      </div>
      <div class="message">Ouch, we Lost!</div>
      <div class="info">
        this page might be eaten by aliens!
      </div>
    </div>
  </section>
</template>

<script>
import PlainNav from "../components/PlainNav";

export default {
  name:"ErrorPage",
  components:{
    PlainNav
  }
}
</script>

<style scoped>
 .container{
   position: absolute;
   width: 100%;
   height: 100%;
   background:linear-gradient(45deg,black,rgb(43, 42, 42));
   display: flex;
   flex-direction: column;
 }
 .wrapper{
   text-align: center;
   flex: 1;
   display: flex;
   flex-direction: column;
   justify-content: center;
 }
 .image img{
   width:100px;
 }
 .message{
   font-weight: bold;
   font-size: 3em;
   color: rgb(255, 255, 255);
 }
 .info{
   color: white;
 }
</style>