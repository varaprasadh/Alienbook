<template>
  <div class='f-content' v-html="parsedContent"></div>
</template>

<script>
export default {
  name:"post-text-content",
  props:['content'],
  computed:{
    parsedContent(){return this.content.replace(/#\w+/gi,match=>`<span class='ptag'>${match}</span>`) }
  }
}
</script>

<style>

</style>