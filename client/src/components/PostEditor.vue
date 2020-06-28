<template>
  <section class="wrapper" v-if="editorOpen">
    <div class="container">
      <div class="editor">
        <div class="editor-container">
          <label>write a post</label>
          <textarea class="post-textarea" type="text" v-model="editorAuxData.content" placeholder="start typing..."></textarea>
          <div class="post-preview">
            <div v-if="type==='SHARE'">
              <div class=""></div>
              <div v-if="editorAuxData.post.type==='SHARE'">
                    <RefPost  :post="editorAuxData.post.originalPost"/>
              </div>
              <div v-else>
                     <RefPost :post="editorAuxData.post"/>
              </div>
            </div>
          </div>
          <div class="actions">
            <div class="action cancel" @click="closeEditor">Cancel</div>
            <div class="action post" @click="post" v-if="type==='NORMAL'">Publish</div>
            <div class="action update" @click="update" v-if="type==='EDIT'">Update</div>
            <div class="action share" @click="share" v-if="type==='SHARE'">Share</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import RefPost from "./RefPost";

export default {
   name:"post-editor",
   components:{
     RefPost
   },
   methods:{
        ...mapMutations(['closeEditor']),
        ...mapActions(['publishPost','updatePost','sharePost']),
        post(){
          if(this.content.trim()===""){
            return;
          }
          this.publishPost({...this.editorAuxData});
        },
        update(){
          if(this.content.trim()===""){
            return;
          }
          this.updatePost({...this.editorAuxData});
        },
        share(){
          this.sharePost({...this.editorAuxData});
        }
   },
   computed:{
     ...mapState(['editorOpen','editorAuxData']),
    ...mapState({
       type:({editorAuxData})=>editorAuxData.type || 'NORMAL',
       content:({editorAuxData})=>editorAuxData.content
      }),
   }
}

</script>

<style scoped>
  .wrapper{
    /* position: relative; */
    position: fixed;
    width: 100%;
    padding-top:80px;
    background: rgba(0, 0, 0, 0.76);
    height: 100%;
    box-sizing: border-box;
    z-index: 99;
  }
  .container{
   max-width: 600px;
   margin:1rem auto;
 }

 .editor{
   background: rgb(255, 255, 255);
   width: 100%;
   box-sizing: border-box;
   overflow: hidden;
   padding: 20px 20px 10px 20px;
 }
  .post-textarea{
   width: 100%;
   height: 150px;
   outline: none;
   border: none; 
   padding: 10px 0px;
   font-size: 1.2rem;
   color: rgb(43, 40, 40);
 }
 .editor label{
   font-size: 1.5rem;
   color: rgb(163, 158, 158);
 }

.actions{
  display: flex;
  justify-content: space-between;
  padding: 0.6rem;
}
.action{
  padding: 10px 20px;
  font-weight: bold;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
.action:hover{
  filter: drop-shadow(1px 1px 1px rgb(88, 87, 87));
}
.action.cancel{
  background: tomato;
}
.action.post{
  background: gray;
}
.action.update{
  background: rgb(26, 179, 107);
}
.action.share{
  background: rgb(31, 48, 196);
}

</style>