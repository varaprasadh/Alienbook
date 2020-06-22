<template>
   <section>
     <nav> </nav>
     <div class="container">
          <div class="control-nav">
            <div class="title">Choose Your Interest</div>
            <div class="button next" @click="uploadTags">
              <span>Next</span>
              <svg class="svg-icon" viewBox="0 0 20 20"><path fill="none" d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"></path></svg>
            </div>
          </div>
          <div class="flex-tags">
              <Tag v-on:selected="addToSelected" v-on:unselected="removeFromSelected" v-for="(tag,i) in tags" class="tag" :key="i" :label="tag.tag"/>
          </div>
     </div>
     <div class="loader" v-if="loading">
        <div class="text">loading...</div>
     </div>
   </section>
</template>

<script>
import axios from 'axios';
import Tag from "../Tag.vue";
export default {
  name:"TagSelector",
  components:{
    Tag
  },
  data:()=>({
    tags:[],
    selectedTags:[],
    loading:true,
    error:false
  }),
  mounted(){
      //call the server 
      //set the tags and display and let the user select
      axios.get('/tags').then(({data})=>{
        if(data.success==true){
          this.tags=data.tags
        }
        this.loading=false;
        this.error=false;
      }).catch(()=>{
        this.loading=false;
        this.error=true;
      })
    
  },
  methods:{
    addToSelected(label){
     this.selectedTags.push(label);
    },
    removeFromSelected(label){
      this.selectedTags=this.selectedTags.filter(tag=>tag!==label);
    },
    uploadTags(){
      this.loading=true;
      axios.post("/tags/follow",{tags:this.selectedTags}).then(({data})=>{
        if(data.success==true){
          this.$router.replace("/");
        }
        this.loading=false;
        this.error=false;
      }).catch(()=>{
          this.loading=false;
          this.error=true;
      })
    }
  }
}
</script>

<style scoped>
section{
  padding: 10px;
}
.title{
  font-weight: bold;
  font-size: 1.5em;
  color: rgb(24, 24, 104);
}
 .flex-tags{
   display: flex;
   flex-wrap: wrap;
   padding: 1em;
 }
 .control-nav{
   display: flex;
   justify-content: space-between;
 }

 .button{
   padding: 0.5em 1em;
   margin-right: .8em;
   font-size: 1.2em;
   border-radius: 10px;
   background: rgb(4, 196, 122);
   color: white;
   font-weight: bold;
   display: flex;
   align-items: center;
   cursor: pointer;
 }
 .button:hover{
   filter: brightness(0.8);
 }
 .loader{
   position: absolute;
   width: 100%;
   height: 100%;
   top:0;
   left:0;
   background: rgba(2, 2, 2, 0.582);
   color: white;
   display: flex;
   justify-content: center;
   align-items: center;
 }

</style>