<template>
  <div class="preview-wrapper">
    <div class="close" @click="$emit('remove')">
        <svg width="20px" viewBox="0 0 329.26933 329" xmlns="http://www.w3.org/2000/svg"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/></svg>
    </div>
    <div class="image-container">
      <div class="preview">
          <img :src="getObjectURI(image)" alt="preview image">
      </div>
    </div>

  </div>
  
</template>

<script>
export default {
  name:"uploadimage-preview",
  props:['image'],
  methods:{
    getObjectURI(image){
        if(typeof image==="string"){
          return image;
        }
        const uri=URL.createObjectURL(image);
        return uri;
    }
  }
}
</script>

<style scoped>
.preview-wrapper{
    position: relative;
}
.preview-wrapper:hover .close{
    display: flex;
}
.close{
    position: absolute;
    right:5px;
    top:5px;
    z-index: 2;
    background: white;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30%;
    cursor: pointer;
    box-shadow: 2px 2px 5px rgb(163, 160, 160);
    display: none;
    transition: all 200ms cubic-bezier(0.075, 0.82, 0.165, 1);
}
.close:hover{
    transform: scale(0.9);
}
 .image-container{
  padding: 5px;
  width: 75px;
  height: 75px;
  box-sizing: border-box;
  /* overflow: hidden; */
}
.image-preview-list .image-container .preview{
  background: rgb(255, 255, 255);
  width: 100%;
  height: 100%;
  border-radius:10px;
  overflow: hidden;
}
.image-preview-list .image-container .preview img{
  width: 100%;
  object-fit: contain;
  height: 100%;
  background: rgb(250, 248, 248);
  user-select: none;
  -webkit-user-drag: none;
}
</style>