<template>
   <div class="loader-wrapper">
       loading...
   </div>
</template>

<script>
export default {
  name:"Loader"
}

</script>

<style scoped>
   .loader-wrapper{
       position: fixed;
       top:0px;
       left: 0px;
       z-index: 99;
       width: 100%;
       height: 100%;
       display: flex;
       justify-content: center;
       align-items: center;
       font-size: 3em;
       background: rgba(0, 0, 0, 0.452);
       color: white;
   }
</style>