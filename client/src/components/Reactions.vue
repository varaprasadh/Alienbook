<template>
 <transition name="reactions">
    <div class="reactions" @click.stop ref="reactions">
        <div class="reaction" data-type="like"  @click="event=>animate(event,'LIKE')">
            <img src="../assets/reactions/like.svg"  alt="like" >
        </div>
        <div class="reaction" data-type="love"  @click="event=>animate(event,'LOVE')">
            <img src="../assets/reactions/love.svg"  alt="love" >
        </div>
        <div class="reaction" data-type="care" @click="event=>animate(event,'CARE')">
            <img src="../assets/reactions/care.svg"  alt="care" >
        </div>
        <div class="reaction" data-type="haha"  @click="event=>animate(event,'HAHA')">
            <img src="../assets/reactions/haha.svg"  alt="haha" >
        </div>
        <div class="reaction" data-type="wow"  @click="event=>animate(event,'WOW')">
            <img src="../assets/reactions/wow.svg"  alt="wow" >
        </div>
        <div class="reaction" data-type="angry"  @click="event=>animate(event,'ANGRY')">
            <img src="../assets/reactions/angry.svg"  alt="angry" >
        </div>
    </div>
 </transition>
</template>

<script>
export default {
  name:"reactions",
  methods:{
      animate(e,type){          
        e.target.classList.add('thrown');
        this.$refs.reactions.classList.add("hide");
        this.$emit('react',type);
      },
      setInPlace(){
            let view=this.$refs.reactions;
            if(!view) return;
            console.log("stuck",view);
            const {x}=view.getBoundingClientRect();
            const docWidth=document.documentElement.clientWidth;
            const width=view.clientWidth;
            let offset=(x+width)-docWidth;
            console.log(offset,"dang");
            if(x+width>docWidth){
                view.style.transform=`translateX(-${offset}px)`;
            }
            console.log(x,width,docWidth,view);
            console.log(view.cloneNode(true));
            setTimeout(()=>{
                console.log(view);
            })
      }
  },
  mounted(){
    this.setInPlace();
  }
}
</script>

<style scoped>
.reactions{
    background: white;
    padding: 5px;
    display: flex;
    justify-content: space-around;
    width: 100%;
    border-radius: 50px;
    box-shadow: 1px 1px 5px rgb(156, 155, 155);
    animation: popup 250ms ease 1;
    transform-origin: left;
    position: relative;
    transition: all 100ms linear;
}
.reactions.hide{
    background: none;
    box-shadow: none;
}
.reactions.hide img:not(.thrown){
   visibility: hidden;
}
.reactions.hide .reaction:hover::before{
    display: none;
}
@keyframes popup{
    0%{
       opacity: 0;
       transform: scale(0.3);
    }
    100%{
      opacity: 1;
      transform: scale(1);
    }
}
.reaction{
    cursor: pointer;
    padding: 2px;
    position: relative;
}
.reaction:hover::before{
    content:attr(data-type);
    color: white;
    padding: 5px 1rem;
    text-align: center;
    background: rgba(17, 17, 17, 0.685);
    position: absolute;
    bottom: 120%;
    left: 50%;
    border-radius: 10px;
    transform: translateX(-50%);
}

.reaction img{
    width: 3em;
}
.reaction:hover > img{
  transform: scale(1.2);
}
.thrown{
    animation: throw 500ms cubic-bezier(0.23, 1, 0.320, 1) 1;
    animation-fill-mode: forwards;
}
@keyframes throw{
   0%{
     transform: translate(0px) scale(1);
     opacity: 1;
   }
   50%{
       opacity: 1;
   }
   100%{
       opacity: 0;
       transform: translateY(-100px) scale(0.4);
   }
}
</style>