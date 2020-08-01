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
            <div class="image-upload-section">
              <div class="image-preview-list">
                <ImagePreview v-for="(image,i) in images" :key="i" :image="image" @remove="removeImage(i)"/>
                <UploadImageButton v-if="images.length<4" @add="addImage"/>
              </div>
            </div>
            <div class="actions">
              <div class="action cancel" @click="closeEditor">Cancel</div>
              <div :class="['action','post',{disable:disableButton}]" @click="post" v-if="type==='NORMAL'">Publish</div>
              <div class="action update" @click="update" v-if="type==='EDIT'">Update</div>
              <div :class="['action','share',{disable:disableButton}]" @click="share" v-if="type==='SHARE'">Share</div>
            </div>
          </div>
        </div>
    </div>
  </section>
</template>

<script>
import {createNamespacedHelpers } from 'vuex'
import RefPost from "./RefPost";

const { mapState, mapMutations, mapActions,mapGetters}=createNamespacedHelpers('editor');

import ImagePreview from "./PostUploadImagePreview";
import UploadImageButton from "./UploadImageButton";

export default {
   name:"post-editor",
   components:{
     RefPost,ImagePreview,UploadImageButton
   },
   methods:{
        ...mapMutations(['closeEditor']),
        ...mapActions(['publishPost','updatePost','sharePost']),
        post(){
          if(this.content.trim()===""){
            return;
          }
          this.publishPost(); 
        },
        update(){
          if(this.content.trim()===""){
            return;
          }
          this.updatePost();
        },
        share(){
          this.sharePost();
        },
        ...mapMutations(['addImage','removeImage'])
   },
   computed:{
     ...mapState(['editorOpen','editorAuxData']),
    ...mapState({
       type:({editorAuxData})=>editorAuxData.type || 'NORMAL',
       content:({editorAuxData})=>editorAuxData.content,
       disableButton:({editorAuxData})=>(editorAuxData.type==="NORMAL" || editorAuxData.type==="EDIT") && editorAuxData.content.trim()===""
      }),
    ...mapGetters(['images'])
   }
}

</script>

<style scoped>
  .wrapper{
    /* position: relative; */
    position: fixed;
    width: 100%;
    padding-top:80px;
    height: 100%;
    box-sizing: border-box;
    z-index: 99;
    animation: animateBg 500ms linear 1 300ms;
    animation-fill-mode: forwards;
  }
  @keyframes animateBg{
    to{
      background: rgba(37, 37, 37, 0.781);
    }
  }

  .container{
   max-width: 600px;
   margin:1rem auto;
   padding: 1rem;
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
  border-radius: 2px;
  cursor: pointer;
}
.action:hover{
  filter: drop-shadow(1px 1px 1px rgb(88, 87, 87));
}
.action.cancel{
  color: rgb(255, 67, 34);
}
.action.cancel:hover{
  filter: none;
}
.action.post{
  background: rgb(10, 100, 173);
}
.action.post.disable,.action.update.disable{
  background: rgb(159, 165, 165);
}
.action.update{
  background: rgb(26, 179, 107);
}
.action.share{
  background: rgb(31, 48, 196);
}

.fade-enter-active, .fade-leave-active{
  transition: all .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
  transform: translateY(-1000px);
}

.image-preview-list{
  display: flex;
  background: rgb(195, 233, 248);
  align-items: center;
}

</style>