<template>
   <transition-group name="liked" mode="out-in">
      <template v-if="!like">
         <div class="react-wrapper" key="2">
            <svg class="icon notliked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 304c0-12.821-5.099-24.768-13.888-33.579 9.963-10.901 15.04-25.515 13.653-40.725-2.496-27.115-26.923-48.363-55.637-48.363H324.352c6.528-19.819 16.981-56.149 16.981-85.333 0-46.272-39.317-85.333-64-85.333-22.144 0-37.995 12.48-38.656 12.992A10.672 10.672 0 00234.666 32v72.341L173.205 237.44l-2.539 1.301v-4.075c0-5.888-4.779-10.667-10.667-10.667H53.333C23.915 224 0 247.915 0 277.333V448c0 29.419 23.915 53.333 53.333 53.333h64c23.061 0 42.773-14.72 50.197-35.264C185.28 475.2 209.173 480 224 480h195.819c23.232 0 43.563-15.659 48.341-37.248 2.453-11.136 1.024-22.336-3.84-32.064 15.744-7.915 26.347-24.192 26.347-42.688 0-7.552-1.728-14.784-4.992-21.312C501.419 338.752 512 322.496 512 304zm-44.992 26.325a10.719 10.719 0 00-8.917 7.232 10.688 10.688 0 002.816 11.136c5.419 5.099 8.427 11.968 8.427 19.307 0 13.461-10.176 24.768-23.637 26.325a10.719 10.719 0 00-8.917 7.232 10.688 10.688 0 002.816 11.136c7.019 6.613 9.835 15.893 7.723 25.451-2.624 11.904-14.187 20.523-27.499 20.523H224c-17.323 0-46.379-8.128-56.448-18.219-3.051-3.029-7.659-3.925-11.627-2.304a10.667 10.667 0 00-6.592 9.856c0 17.643-14.357 32-32 32h-64c-17.643 0-32-14.357-32-32V277.333c0-17.643 14.357-32 32-32h96V256c0 3.691 1.92 7.125 5.077 9.088a10.902 10.902 0 0010.368.448l21.333-10.667a10.65 10.65 0 004.907-5.056l64-138.667c.64-1.408.981-2.944.981-4.48V37.781c4.438-2.453 12.14-5.781 21.334-5.781C289.024 32 320 61.056 320 96c0 37.547-20.437 91.669-20.629 92.203a10.739 10.739 0 001.173 9.856 10.728 10.728 0 008.789 4.608h146.795c17.792 0 32.896 12.736 34.389 28.992 1.131 12.16-4.715 23.723-15.189 30.187-3.264 2.005-5.205 5.632-5.056 9.493s2.368 7.317 5.781 9.088c9.024 4.587 14.613 13.632 14.613 23.573.001 13.461-10.175 24.768-23.658 26.325z"/><path d="M160 245.333c-5.888 0-10.667 4.779-10.667 10.667v192c0 5.888 4.779 10.667 10.667 10.667s10.667-4.779 10.667-10.667V256c0-5.888-4.779-10.667-10.667-10.667z"/></svg>
            <div class="text">LIKE</div>
         </div>
      </template>
      <template v-else>
         <div class="react-wrapper" key="1" v-if="like.type==='LIKE'">
            <svg class="icon like" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M53.333 224C23.936 224 0 247.936 0 277.333V448c0 29.397 23.936 53.333 53.333 53.333h64c12.011 0 23.061-4.053 32-10.795V224h-96zM512 304c0-12.821-5.077-24.768-13.888-33.579 9.963-10.901 15.04-25.515 13.653-40.725-2.496-27.115-26.923-48.363-55.637-48.363H324.352c6.528-19.819 16.981-56.149 16.981-85.333 0-46.272-39.317-85.333-64-85.333-22.165 0-37.995 12.48-38.677 12.992A10.72 10.72 0 00234.667 32v72.341l-61.44 133.099-2.56 1.301v228.651C188.032 475.584 210.005 480 224 480h195.819c23.232 0 43.563-15.659 48.341-37.269 2.453-11.115 1.024-22.315-3.861-32.043 15.765-7.936 26.368-24.171 26.368-42.688 0-7.552-1.728-14.784-5.013-21.333C501.419 338.731 512 322.496 512 304z"/></svg>
            <span class="text">LIKE</span>
         </div>
         <div class="react-wrapper" key="3" v-if="like.type==='LOVE'">
            <img class="icon love" src="../assets/reactions/love.svg"  alt="love">
            <span class="text">LOVE</span>
         </div>
         <div class="react-wrapper" key="4" v-if="like.type==='CARE'">
            <img class="icon care"  src="../assets/reactions/care.svg"  alt="care">
            <span class="text">CARE</span>
         </div>
         <div class="react-wrapper" key="5" v-if="like.type==='HAHA'">
            <img class="icon haha"   src="../assets/reactions/haha.svg"  alt="haha">
            <span class="text">HAHA</span>
         </div>
         <div class="react-wrapper" key="6" v-if="like.type==='WOW'">
            <img class="icon wow" src="../assets/reactions/wow.svg"   alt="wow">
            <span class="text">WOW</span>
         </div>
         <div class="react-wrapper" key="7" v-if="like.type==='ANGRY'">
            <img class="icon angry"  src="../assets/reactions/angry.svg" alt="angry">
            <span class="text">ANGRY</span>
         </div>
      </template>
      </transition-group>
</template>

<script>
export default {
  name:"like",
  props:['like']
}
</script>

<style scoped>
.react-wrapper{
   display: flex;
   align-items: center;
}
.icon svg{
    width:2rem;
}
.icon{
   width: 2rem;
   margin-right: 10px;
}
.icon.like{
   fill: rgb(36, 84, 214);
}
.icon.notliked ~ .text{
   color: rgb(0, 0, 0);
}
.icon.like ~ .text{
   color: rgb(36, 84, 214);
}
.icon.love ~ .text{
  color: red;
}
.icon.care ~ .text{
  color: red;
}
.icon.haha ~ .text{
    color:  rgb(226, 105, 49);
}
.icon.angry ~ .text{
  color: rgb(209, 114, 130);
}
.icon.wow~ .text{
  color: rgb(226, 105, 49);
}
.liked-enter,
.liked-leave-to {
  opacity: 1;
}
.liked-enter-active{
  transition: all 100ms ease;
}
.liked-leave-active {
  transition: all 0s ease;
}

.liked-enter.react-wrapper .text,
.liked-leave-to.react-wrapper .text{
   transform:translateX(30px);
   opacity: 0;
}
.liked-enter-active.react-wrapper .text,
.liked-leave-active.react-wrapper .text{
   transition: all 250ms ease;
}

.liked-enter.react-wrapper .icon,
.liked-leave-to.react-wrapper .icon{
   transform:translateX(-20px);
   opacity: 0;
}
.liked-enter-active.react-wrapper .icon{
   transition: all 250ms ease;
}
.liked-leave-active.react-wrapper .icon{
   transition: all 150ms ease;
}
</style>