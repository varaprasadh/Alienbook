<template>
  <div :class="['tag',{selected:selected}]" @click="toggleSelection">{{label}}</div>
</template>

<script>
export default {
  name:"Tag",
  data:()=>({
   
  }),
  props:["label",'selected'],
  methods:{
    toggleSelection(){
      this.selected=!this.selected;
      if(this.selected){
        this.$emit('selected',this.label);
      }else{
        this.$emit('unselected',this.label);
      }
    }
  }
}
</script>

<style scoped>
 .tag{
   margin: 5px;
   padding: 0.5em 1.5em;
   border: 2px solid rgb(9, 9, 29);
   border-radius: 10px;
   font-weight: bold;
   font-size: 1.5em;
   cursor: pointer;
   transition: all 0.3s ease;
   color: black;
 }
 .selected{
   background: rgb(27, 27, 138);
   color: white;
 }
</style>