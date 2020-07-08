<template>
  <nav>
      <div class="logo"  @click="$router.replace('/')">
          <img src="../assets/png/logo_white.png" alt="logo">
      </div>
  </nav>
</template>

<script>
export default {
  name:"plainNav"
}
</script>

<style scoped>
 nav{
    padding: 10px;
    background: rgb(0, 1, 3);
 }
 .logo{
   cursor: pointer;
 }
 
 nav img{
     width: 100px;
 }
</style>