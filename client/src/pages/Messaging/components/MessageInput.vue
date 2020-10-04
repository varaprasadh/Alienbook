<template>
  <div class="message-input-container">
    <div class="input-wrapper">
      <div class="input">
         <input type="text" v-model="text">
      </div>
      <div class="icon send" @click="onSend">
        send
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name:"message-input",
  data(){
    return({
      text:""
    })
  },
  methods:{
    onSend(){
      if(this.text.trim()==="") return;
      //todo add media

      let raw_message={
        text:this.text,
        files:[]
      }

      this.$emit("onsend",raw_message);
    }
  }

}
</script>

<style scoped>
.message-input-container{
    border: 1px solid rgb(129, 127, 127);
}
.input-wrapper{
  display: flex;
}
.input-wrapper .input {
  flex: 1;
}
.input-wrapper .input input{
  width: 100%;
  border: none;
  padding: 0.5em 0.5em;
  font-size: 1.2em;
  box-sizing: border-box;
}
.input-wrapper .icon{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0.2em;
}

</style>