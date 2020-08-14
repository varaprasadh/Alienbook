<template>
  <div id="loading" ref="loader"></div>
</template>

<script>
export default {
  name:"spinner",
  props:['color'],
  mounted(){
      this.$refs.loader.style.setProperty('border-top-color',this.color || 'black');
  }
}
</script>

<style scoped>
#loading {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
</style>