<template>
  <div class="avatar-wrapper">
      <div v-if="src" class="image-container" ref="image_container">
          <img :src="src" alt="avatar">
      </div>
      <div v-else class="image-container" ref="image_container">
          <img src="../assets/png/Avatar.png" alt="avatar"/>
      </div>
      
  </div>
</template>

<script>

export default {
  name:"avatar",
  props:['src',"size"],
  components:{
  },
  mounted(){
      const el=this.$refs.image_container;
      if(this.size){
        el.style.width=this.size+"px";
        el.style.height=this.size+"px";
      }
  }
}
</script>

<style scoped>
.image-container{
    width:2.5em;
    height: 2.5em;
    overflow: hidden;
    border-radius: 50%;
    border: 2px solid rgb(98, 99, 100);
}
.image-container img{
    object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>