<template>
   <div class="loader-wrapper">
      <div class="loader">
        <div class="load-bar"></div>
      </div>
      <div class="info">please wait..</div>
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
       flex-direction: column;
       background: rgba(54, 54, 54, 0.719);
   }
   .loader{
     width: 100px;
     background: white;
     position: relative;
     height: 10px; 
     overflow: hidden;
   }
   .load-bar{
    position: absolute;
    top:0px;
    left:0px;
    height: 10px;
    background: rgb(0, 0, 0);
    animation: animate 1s ease-in-out infinite alternate-reverse;
   }
   .info{
     padding: 10px 1em;
     color: rgb(226, 234, 255);
   }
   @keyframes animate{
     0%{
       left: 0%;
       width:10%;
     }
     100%{
       width: 50%;
       left:100%;
     }
   }
</style>