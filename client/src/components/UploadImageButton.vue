<template>
  <div class="preview-wrapper" @click="openFileDialogue">
      <div class="image-container">
        <input type="file" @change="addImage" ref="input" hidden accept="image/jpeg">
        <div class="add">
            <svg viewBox="0 0 329.26933 329" xmlns="http://www.w3.org/2000/svg"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/></svg>
        </div>
      </div>
  </div>
  
</template>

<script>
export default {
  name:"upload-image-button",
  methods:{
      openFileDialogue(){
          this.$refs.input.click();
      },
      addImage(){
          const file=this.$refs.input.files[0];
          if(!file) return;
          this.$emit("add",file);
      }
  }

}
</script>

<style scoped>
.preview-wrapper{
    position: relative;
    cursor: pointer;
    transition: all 200ms linear;
}
.preview-wrapper:hover{
    filter: brightness(0.8);
}
.add{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 5px;
}
.add svg{
    display: flex;
    transform: rotate(45deg);
    width: 30px;
}

 .image-container{
  padding: 5px;
  width: 75px;
  height: 75px;
  box-sizing: border-box;

}

</style>