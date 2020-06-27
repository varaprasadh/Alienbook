<template>
    <div class="gl-loader-wrapper">
       <div class="glh-loader" v-if="gl_h_loader">
            <div class="bar"></div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name:"glh-loader",
  computed:{
      ...mapState(['gl_h_loader'])
  }
}
</script>

<style scoped>
.glh-loader{
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 5px;
    background: rgb(219, 17, 175);
}
 .bar{
     height: 100%;
     top:0px;
     width: 10%;
     background: rgb(26, 66, 177);
     position: absolute; 
     animation: load 1s linear infinite;
     
 }
 @keyframes load {
     from{
         left:0%;
         width: 20%;
     }
     to{
         left: 100%;
         width: 100%;
     }
 }
</style>