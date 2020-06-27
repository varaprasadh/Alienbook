<template>
  <section class="feed">
    <div class="container">
      <div class="editor">
        <div class="editor-container">
          <label>write a post</label>
          <textarea class="post-textarea" type="text" placeholder="start typing..."></textarea>
          <div class="actions">
            <div class="action cancel">cancel</div>
            <div class="action post">post</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
    name:"feed",
    components:{

    },
    mounted(){

    }
}
</script>

<style scoped>
  .feed{
    /* position: relative; */
    position: fixed;
    width: 100%;
    padding-top:80px;
    background: rgba(10, 10, 10, 0.609);
    height: 100%;
    box-sizing: border-box;
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
  border-radius: 10px;
  cursor: pointer;
}
.action:hover{
  filter: drop-shadow(1px 1px 2px black);
}
.action.cancel{
  background: tomato;
}
.action.post{
  background: gray;
}

</style>