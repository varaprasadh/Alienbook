<template>
  <section class="container">
    <nav>todo</nav>
    <div class="wrapper">
      <div class="image">
        <img src="../../assets/404.svg" alt="404">
      </div>
      <div class="message">Ouch, we Lost!</div>
    </div>
  </section>
</template>

<script>
export default {
  name:"ErrorPage"
}
</script>

<style scoped>
 .container{
   height: 100vh;
   background: white;
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
   width:20em;
 }
 .message{
   font-weight: bold;
   font-size: 3em;
   color: rgb(44, 44, 163);
 }
</style>