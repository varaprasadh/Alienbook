<template>
  <section class="feed">
    <div class="container">
      <!-- <div class="create-post-skeleton">
          <div class="create-button">WRITE A POST!</div>
      </div> -->
      
    </div>
  </section>
</template>

<script>
// import userAvatar from "../components/svg/user_avatar";

export default {
    name:"feed",
    components:{
      
    },
    mounted(){

    }
}
</script>

<style scoped>
.container{
   max-width: 600px;
   margin:1rem auto;
 }
 .create-post-skeleton{
   /* background: white; */
   display: flex;
  justify-content: center;
 }
.create-button{
  background: rgb(16, 172, 68);
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  padding:10px 20px;
  border-radius: 5px;
}

</style>