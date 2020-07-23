<template>
    <div class="message-prompt">
        <div class="form">
        <div class="input-wrapper">
            <input type="text" class="message-input" v-model.trim="text" placeholder="write your message">
            <div class="char-count">
            <div class="text" :class="{warn:charCount<0}">{{charCount}}</div>
            </div>
        </div>
        <div class="btn-wrapper">
            <div class="btn cancel" @click="$emit('cancel')">cancel</div>
            <div class="btn submit" :class="{disable:charCount<0 || text.length==0}" @click="send">Send</div>
        </div>
        </div>
    </div>
</template>

<script>
export default {
   name:"quickMessagePrompt",
   data(){
     return({
       text:""
     })
   },
   computed:{
        charCount(){
            return 30-this.text.length;
        }
   },
   methods:{
     send(){
         if(this.charCount<0 || this.text.length==0){
            //vibrate the form
            return;
        }
        this.$emit("message",this.text);
     }
   }
}
</script>

<style scoped>

 .message-prompt{
   position: absolute;
   height: 100%;
   top:0px;
   width: 100%;
   background: rgba(50, 50, 51, 0.596);
   z-index: 99;
   left: 0px;
   display: flex;
   align-items: center;
 }
.form{
  background: white;
  padding: 1em;
  margin: 0px auto;
  border-radius: 5px;
}
.message-prompt input{
  border: none;
  outline: none;
  background: rgb(231, 231, 231);
  padding: 5px 10px;
  font-size: 1.2em;
}
.btn-wrapper{
  display: flex;
  justify-content: space-between;
}
.message-prompt .btn{
  font-size: 1.3em;
  text-align: end;
  color: rgb(0, 0, 153);
  padding: 5px 10px 0px;
  cursor: pointer;
}
.message-prompt .btn.disable{
  color: gray;
  cursor: not-allowed;
}
.message-prompt .btn.cancel{
  color: tomato;
}

.char-count{
  display: flex;
  justify-content: flex-end;
}
.char-count .text{
  font-size: 0.9em;
  font-weight: bold;
  color: rgb(110, 109, 109);
}
.char-count .text.warn{
  color: tomato;
}
</style>