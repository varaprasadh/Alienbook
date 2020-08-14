<template>
  <div class="container">
     <div class="img-grid" :class="`grid-${images.length}`" @click="showModal=true">
       <div class="image-wrapper" v-for="(image,i) in images" :key="i">
         <img class="image" :src="image" alt="photo">
       </div>
     </div>
     <div class="modal" v-if="showModal">
        <PlainHeader/>
       <div class="slider-header">
         <div class="btn back" @click="showModal=false">
           back
         </div>
         <div class="position">{{this.index+1+"/"+this.images.length}}</div>
         <div class="btn options">
           <!-- options -->
         </div>
       </div>
       <div class="slider">
         <div class="control prev" @click="prevImage">
              <div  v-if="index>0">&lt;</div>
         </div>
         <div class="slider-image">
           <img :src="images[index]" alt="some image">
         </div>
         <div class="control next" @click="nextImage">
            <div v-if="index<images.length-1">&gt;</div>
         </div>
       </div>
     </div>
  </div>
</template>

<script>
import PlainHeader from "./PlainNav"
export default {
  name:"post-images",
  props:['images'],
  components:{
    PlainHeader
  },
  data(){
    return ({
      index:0,
      showModal:false
    })
  },
  methods:{
    nextImage(){
      if(this.index==this.images.length-1){
        return;
      }
      this.index++;
    },
    prevImage(){
      if(this.index==0){
        return;
      }
      this.index--;
    }
  }
}
</script>

<style scoped>
.container{
  width: 100%;
  overflow: hidden;
  z-index: -1;
}
.img-grid{
  width: 100%;
  
  display: grid;
  background: rgb(227, 224, 230);
  /* grid-auto-flow: dense; */
  /* flex-wrap: wrap; */
}
.img-grid.grid-1{
  grid-template-columns: 1;
}
.img-grid.grid-2,
.img-grid.grid-4
{
  grid-template-columns:repeat(2,1fr);
  max-height: 200px;
}
.image-wrapper{
  flex: 1;
  display: flex;
  align-items: center;
  background: black;
  border: 1px solid rgb(139, 138, 138);
  cursor: pointer;
  overflow: hidden;
}
/* .image-wrapper:hover .image{
   transform: scale(1.2);
} */
.img-grid .image{
  width: 100%;
  height: 100%;
  object-fit:cover;
  /* transition:all 200ms cubic-bezier(0.075, 0.82, 0.165, 1);  */

}
.btn{
  cursor: pointer;
}
.btn:hover{
  filter:brightness(0.9);
  text-decoration: underline;
}
.modal{
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 99;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.slider{
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}
.control{
  font-weight: bold;
  font-size: 2em;
  color: rgb(243, 243, 243);
  padding: 10px;
  align-self: stretch;
  display: flex;
  align-items:center;
  min-width: 20px;
  user-select: none;
}
.slider-image{
  width: 70%;
  max-width: 500px;
  border-radius: 10px;
}
.slider-image img{
  width: 100%;
  border: 2px solid rgb(168, 168, 170);
  -webkit-user-drag: none;
  user-select: none;
}
.slider-header{
  padding: 10px;
  display: flex;
  justify-content: space-between;
  color: white;
}

</style>