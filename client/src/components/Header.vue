<template>
  <div class="header-wrapper">
      <div class="header">
           <div class="icon">
               <slot></slot>
           </div>
           <div class="label">
               {{label}}
           </div>
           <div></div>
      </div>
  </div>
</template>

<script>
export default {
  name:"header",
  props:['label']
}
</script>

<style scoped>
.header-wrapper{
    padding: 10px;
    background: black;
    color: white;
}
.header{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
 .label{
   font-size: 2rem;
   font-weight: bold;
 }

</style>