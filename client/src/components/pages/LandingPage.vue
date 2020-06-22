<template>
   <section>
       <div class="container">
           <nav></nav>
           <div class="container">
               <div class="box left">
                    <img src="../../assets/home_main.svg" alt="main image">
               </div>
               <div class="box right">
                  <div class="slogan">
                      Ideas Comes From Space!
                  </div>
                  <div class="desc">
                      share your ideas, we push them to the space!
                  </div>
                  <div class="button-wrapper">
                      <router-link to="/auth/switch/login"><span class="btn" >Login</span></router-link>
                      <router-link to="/auth/switch/signup"><span class="btn" >Signup</span></router-link>
                  </div>
               </div>
           </div>
       </div>
   </section>
</template>

<script>
export default {
   name:"Home"
}
</script>

<style scoped>
.container{
    display: flex;
}
.box.right{
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
}
.slogan{
    font-weight: bold;
    font-size: 5em;
    color:rgb(27, 27, 99);
}
.desc{
    font-size: 1.2em;
    color: rgb(80, 83, 83);
}
.button-wrapper{
    display: flex;
}
.button-wrapper a{
   text-decoration: none;
   background: rgb(17, 61, 117);
   padding: .6em 1.5em;
   color: white;
   display:block;
   margin: 1em 0em;
   font-weight:bold;
}
.button-wrapper a:nth-child(2){
    margin-left: 1em;
}
</style>