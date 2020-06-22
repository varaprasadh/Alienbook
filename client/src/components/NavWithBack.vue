<template>
    <nav>
        <BackButton/>
        <slot></slot>
    </nav>
</template>

<script>
import BackButton from "./BackButton";
export default {
   name:"nav-with-back",
   components:{
       BackButton
   }
}
</script>

<style scoped>
 nav{
   padding: 1em;
   background: rgb(4, 11, 54);
   display: flex;
   color: white;
   align-items: center;
   justify-content: space-between;
 }
</style>