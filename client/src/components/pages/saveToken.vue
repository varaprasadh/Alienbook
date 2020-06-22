<template>
  <section>
     <div class="car">
         <div class="loader">
              logging you in...
         </div>
     </div>
  </section>
</template>

<script>
export default {
  name:"save-token",
  data:()=>({
    
  }),
  mounted(){
     let params=new URLSearchParams(decodeURIComponent(location.search));
     let token=params.get('token');
     localStorage.setItem('token',token);
     setTimeout(()=>{
        this.$router.replace("/");
     },2000);
  }
}
</script>

<style scoped>
 section{
     height: 100vh;
     display: flex;
     justify-content: center;
     align-items: center;
 }
</style>