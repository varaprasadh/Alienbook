<template>
    <div class="editor">
           <div class="editor-main">
               <div class="input-field">
                    <label for="post">write your idea</label>
                    <textarea name="post"  class="post" v-model="post"></textarea>
               </div>
               <div class="input-field tag-field">
                   <label for="tags">Tags</label>
                   <div class="tags-wrapper">
                       <div  v-for="(tag,i) in tags" :class="'tag '+colors[i%colors.length]" :key="i">{{tag}}</div>
                       <input type="text" @keyup="processTag($event)"  class="tag-input auto-complete" v-model="tagText"/>
                   </div>
                   <div class="autofill-tags">
                       <div v-for="(tag,i) in autoFillTags" @click="addTag(tag)" :key="i" class="item">{{tag}}</div>
                   </div>
               </div>
                <div class="editor-nav">
                    <div class="button cancel" @click="closeEditor">Cancel</div>
                    <div class="button publish" @click="publishPost">Publish</div>
                </div>
            </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name:"Editor",
  mounted(){
      
  },
  data:()=>({
      post:"",
      tags:[],
      tagText:"",
      colors:['red','orange','blue','gray','cyan'],
      autoFillTags:[]
  }),


  methods:{
      closeEditor(){
          this.$emit('closeEditor');
      },
      processTag(e){
          //bs-8 
          //enter -13
         if(e.which==13){
             let parsedText=this.tagText.replace(/\s+/,"");
             if(parsedText==="") return;
             this.tags.push(parsedText);
             this.tagText="";
         }else if(e.which==8 && this.tagText.trim()===""){
              this.tags.pop();
         }
      },
      addTag(tag){
          this.tags.push(tag);
          this.tagText="";
      },
      publishPost(){
          if(this.post.trim()===""){
              //show alert
              return;
          }
          axios.post("/posts/create",{
              content:this.post,
              tags:this.tags
          }).then(({data})=>{
              if(data.success==true){
                  //display published alert
                  alert("published");
                  this.closeEditor();
              }else{
                  //show error message
              }
          }).catch(()=>{
              //show error message
              this.closeEditor();
          })
      }
  }
}
</script>

<style scoped>

.editor{
    position: fixed;
    top:0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.787);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 99;
}

.editor-main{
    padding: 1em 2em;
    background: rgb(255, 255, 255);
    filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.692));
    margin: 1em;
    border-radius: 2px;
    flex: 1;
    max-width: 500px;
}
.editor-nav{
    display: flex;
    justify-content: space-between;
}

.input-field{
   margin: 1em 0em;
}

.input-field label{
    font-size: 1em;
    font-weight: bold;
    color: rgb(83, 83, 136);
}
.input-field input,.input-field textarea{
    background: none;
    border: none;
    outline: none;
    width: 100%;
    margin: 0px;
    border-bottom: 1px solid rgb(83, 75, 75);
    font-size: 1.5em;
}
.input-field textarea{
   min-height: 100px;
}
.input-field input::placeholder,.input-field textarea::placeholder{
  color: rgba(168, 159, 159, 0.705);
}

.tags-wrapper{
    display: flex;
    border-bottom: 1px solid rgb(83, 75, 75);
    flex-wrap: wrap;
}
.tags-wrapper input{
    border: none;
    flex: 1;
    min-width:50px;
}
.tag-input{
    display: inline;
}
.tag-field{
    position: relative;
}
.autofill-tags{
   position: absolute;
   width: 100%;
   background: rgb(201, 211, 201);
}
.autofill-tags .item{
    background: rgb(255, 255, 255);
    margin: 2px 0px;
    cursor: pointer;
}
.autofill-tags .item:hover{
    filter: brightness(0.9);
}


.button{
    padding: 0.5em 1em;
    color: white;
    cursor: pointer;
    font-size: 1.3em;
    font-weight: bold;
    border-radius:2px;
    transition: all 0.3s linear;
}
.button:hover{
    filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.616));
}
.button.cancel{
    background: rgb(248, 70, 38);
}
.button.publish{
    background: rgb(12, 56, 126);
}
</style>