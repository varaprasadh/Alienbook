<template>
  <section>
    <PlainNav/>
    <div class="auth-container">
      <transition name="slide" appear>
        <div class="auth-card">
          <div class="auth-header">
            <span class="text">login with</span>
          </div>
          <div class="auth-options">
            <div class="auth-option-wrapper">
              <a :href="`${baseURL}/auth/facebook`" class="auth-option facebook">
                facebook
              </a>
            </div>
            <div class="auth-option-wrapper">
              <a :href="`${baseURL}/auth/google`" class="auth-option google">
                google
              </a>
            </div>
            <div class="auth-option-wrapper">
              <a :href="`${baseURL}/auth/linkedin`" class="auth-option linkedin">
                linkedin
              </a>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>
<script>
import PlainNav from "../components/PlainNav";
import Axios from 'axios';
export default {
  name: "Auth",
  components: {
    PlainNav
  },
  data(){
    return ({
      baseURL:Axios.defaults.baseURL
    })
  },
  beforeRouteEnter(to,from,next){
    if(localStorage.getItem('token')){
     next("/");
    }else{
      next();
    }
  }
};
</script>

<style scoped>
section{
  height: 100%;
  width: 100%;
  position: absolute;
  box-sizing: border-box;
  background: rgb(208, 208, 216);
  display: flex;
  flex-direction: column;
}
.auth-container{
  display: flex;
  justify-content: center;
}

.auth-card{
  padding: 1em;
  background: white;
  margin: 1em;
  max-width: 400px;
  filter:drop-shadow(2px 2px 5px rgb(179, 176, 176));
}
.auth-header{
  text-align: center;
  font-weight: bold;
  font-size: 1.5em;
  color: rgb(33, 33, 34);
  margin-bottom: 1em;
}
.auth-header .text{
  position: relative;
}
.auth-header .text::before,
.auth-header .text::after
{
  height: 3px;
  width: 50%;
  position: absolute;
  content:"";
  display:block;
  background: rgb(51, 89, 195);
  right:100%;
  top:50%;
  transform: translateY(-50%);
  margin:0px 10px;
}
.auth-header .text::after{
  left: 100%;
}

.auth-options{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.auth-option{
  flex: 1;
  font-size: 1.3em;
  padding: 0.3em 1em;
  margin: 10px;
  font-weight: bold;
  text-align: center;
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.auth-option::before{
  display: block;
  content: "";
  top:0px;
  left:0px;
  width: 100%;
  height:100%;
  background:black;
  position: absolute;
  transition: transform 300ms linear;
  transform-origin: left;
  transform: scaleX(0);
 
}
.auth-option:hover::before{
 transform: scaleX(1);
 transform-origin: right;
 z-index: -1;
}

.auth-option:hover{
  filter: brightness(0.7);
}
.auth-option.facebook{
  background: #3B5998;
}
.auth-option.google{
  background: rgb(245, 96, 69);
}
.auth-option.linkedin{
  background: #0e76a8;
}
.slide-enter-active, .slide-leave-active{
  transition: all 300ms ease-in-out;
}
.slide-enter, .slide-leave-to{
  opacity: 0;
  transform: translateY(200px);
}
</style>