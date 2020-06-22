<template>
  <section class="profile">
      <nav class="nav-bar">
          <router-link to="/">
              <BackButton/>
          </router-link>
          <div class="i_am_username">
             <div class="icon">
                <svg class="svg-icon" viewBox="0 0 20 20">
					<path fill="none" d="M19.629,9.655c-0.021-0.589-0.088-1.165-0.21-1.723h-3.907V7.244h1.378V6.555h-2.756V5.866h2.067V5.177h-0.689V4.488h-1.378V3.799h0.689V3.11h-1.378V2.421h0.689V1.731V1.294C12.88,0.697,11.482,0.353,10,0.353c-5.212,0-9.446,4.135-9.629,9.302H19.629z M6.555,2.421c1.522,0,2.756,1.234,2.756,2.756S8.077,7.933,6.555,7.933S3.799,6.699,3.799,5.177S5.033,2.421,6.555,2.421z"></path>
					<path fill="none" d="M12.067,18.958h-0.689v-0.689h2.067v-0.689h0.689V16.89h2.067v-0.689h0.689v-0.689h-1.378v-0.689h-2.067v-0.689h1.378v-0.689h2.756v-0.689h-1.378v-0.689h3.218c0.122-0.557,0.189-1.134,0.21-1.723H0.371c0.183,5.167,4.418,9.302,9.629,9.302c0.711,0,1.401-0.082,2.067-0.227V18.958z"></path>
				</svg>
             </div>
              <div class="name">varaprasadh</div>
          </div>
      </nav>
      <div class="posts">
          <!-- <div class="posts-wrapper"> -->
             <Post v-for="(post,i) in posts" :key="i" 
                  :post="post"
                  v-on:postDeleted="removePost"
            />
          <!-- </div> -->
      </div>
  </section>
</template>

<script>
import BackButton from "../BackButton";
import Post from "../Post";
import { mapMutations, mapState } from 'vuex';
import axios from 'axios';
export default {
  name:"Profile",
  components:{
      BackButton,Post
  },
  data:()=>({
      posts:[]
  }),
  computed:{
    ...mapState(['user'])
  },
  methods:{
      ...mapMutations(['runLoader','stopLoader']),
      removePost(id){
          let index=this.posts.find(post=>post.id===id);
          if(index!=-1){
              this.posts.splice(index,1);
          }
      }
  },
  mounted(){
     this.runLoader();
     axios.get(`/posts/user/${this.$route.params.username||''}`).then(({data})=>{
         if(data.success==true){
             this.posts=data.posts;
         }
         this.stopLoader();
     }).catch(()=>{
         this.stopLoader();
     })
  }
}

</script>

<style scoped>
.svg-icon{
    width: 2em;
    height: 2em;
}
.svg-icon path{
    fill:white;
}
a{
    display: block;
    text-decoration: none;
    color: white;
}

 nav{
   padding: 1em;
   background: rgb(4, 11, 54);
   display: flex;
   color: white;
   align-items: center;
   width: 100%;
   box-sizing: border-box;
   display: flex;
   justify-content: space-between;
   color: white;
 }

.i_am_username{
    text-align: center;
}
.posts{
   display: flex;
   flex-direction: column;
   align-items: center;
 }
 @media screen and (max-width:600px){
    .posts{
      align-items: stretch;
    }
 }
</style>