<template>
  <section class="nav-wrapper">
     <nav class="main-nav">
       <div class="nav-container">
           <div class="nav-group">
               <div class="nav-item-logo">
                   <router-link class="nav-link" to="/">
                      <img src="../assets/png/logo_white.png" alt="alienbook-logo">
                   </router-link>
               </div>
           </div>
           <div class="nav-group sm-bottom">
               <div class="nav-item write-post" @click="openEditor({})">
                   <div class="icon">
                    <svg class="svg-icon" viewBox="0 0 20 20"><path fill="none" d="M13.388,9.624h-3.011v-3.01c0-0.208-0.168-0.377-0.376-0.377S9.624,6.405,9.624,6.613v3.01H6.613c-0.208,0-0.376,0.168-0.376,0.376s0.168,0.376,0.376,0.376h3.011v3.01c0,0.208,0.168,0.378,0.376,0.378s0.376-0.17,0.376-0.378v-3.01h3.011c0.207,0,0.377-0.168,0.377-0.376S13.595,9.624,13.388,9.624z M10,1.344c-4.781,0-8.656,3.875-8.656,8.656c0,4.781,3.875,8.656,8.656,8.656c4.781,0,8.656-3.875,8.656-8.656C18.656,5.219,14.781,1.344,10,1.344z M10,17.903c-4.365,0-7.904-3.538-7.904-7.903S5.635,2.096,10,2.096S17.903,5.635,17.903,10S14.365,17.903,10,17.903z"></path></svg>
                   </div>
               </div>
               <div class="nav-item home" :class="{active:currentPage==='/'}">
                   <router-link class="nav-link" to="/">
                   <div class="icon">
                     <svg class="svg-icon" viewBox="0 0 20 20"><path d="M17.728,4.419H2.273c-0.236,0-0.429,0.193-0.429,0.429v10.304c0,0.234,0.193,0.428,0.429,0.428h15.455c0.235,0,0.429-0.193,0.429-0.428V4.849C18.156,4.613,17.963,4.419,17.728,4.419 M17.298,14.721H2.702V9.57h14.596V14.721zM17.298,8.712H2.702V7.424h14.596V8.712z M17.298,6.566H2.702V5.278h14.596V6.566z M9.142,13.005c0,0.235-0.193,0.43-0.43,0.43H4.419c-0.236,0-0.429-0.194-0.429-0.43c0-0.236,0.193-0.429,0.429-0.429h4.292C8.948,12.576,9.142,12.769,9.142,13.005"></path></svg>
                   </div>
                   </router-link>
               </div>
               <div class="nav-item find Aliens"  :class="{active:currentPage==='/aliens'}">
                   <router-link class="nav-link" to="/aliens">
                   <div class="icon">
                        <svg class="svg-icon" viewBox="0 0 20 20"><path d="M15.573,11.624c0.568-0.478,0.947-1.219,0.947-2.019c0-1.37-1.108-2.569-2.371-2.569s-2.371,1.2-2.371,2.569c0,0.8,0.379,1.542,0.946,2.019c-0.253,0.089-0.496,0.2-0.728,0.332c-0.743-0.898-1.745-1.573-2.891-1.911c0.877-0.61,1.486-1.666,1.486-2.812c0-1.79-1.479-3.359-3.162-3.359S4.269,5.443,4.269,7.233c0,1.146,0.608,2.202,1.486,2.812c-2.454,0.725-4.252,2.998-4.252,5.685c0,0.218,0.178,0.396,0.395,0.396h16.203c0.218,0,0.396-0.178,0.396-0.396C18.497,13.831,17.273,12.216,15.573,11.624 M12.568,9.605c0-0.822,0.689-1.779,1.581-1.779s1.58,0.957,1.58,1.779s-0.688,1.779-1.58,1.779S12.568,10.427,12.568,9.605 M5.06,7.233c0-1.213,1.014-2.569,2.371-2.569c1.358,0,2.371,1.355,2.371,2.569S8.789,9.802,7.431,9.802C6.073,9.802,5.06,8.447,5.06,7.233 M2.309,15.335c0.202-2.649,2.423-4.742,5.122-4.742s4.921,2.093,5.122,4.742H2.309z M13.346,15.335c-0.067-0.997-0.382-1.928-0.882-2.732c0.502-0.271,1.075-0.429,1.686-0.429c1.828,0,3.338,1.385,3.535,3.161H13.346z"></path></svg>
                   </div>
                   </router-link>
               </div>
               <div class="nav-item notifications" :class="{active:currentPage==='/notifications'}">
                  <router-link class="nav-link" to="/notifications">
                    <div class="icon">
                        <div class="badge" v-if="getUnreadNotifCount>0">{{getUnreadNotifCount}}</div>
                        <svg class="svg-icon" viewBox="0 0 20 20"><path d="M14.38,3.467l0.232-0.633c0.086-0.226-0.031-0.477-0.264-0.559c-0.229-0.081-0.48,0.033-0.562,0.262l-0.234,0.631C10.695,2.38,7.648,3.89,6.616,6.689l-1.447,3.93l-2.664,1.227c-0.354,0.166-0.337,0.672,0.035,0.805l4.811,1.729c-0.19,1.119,0.445,2.25,1.561,2.65c1.119,0.402,2.341-0.059,2.923-1.039l4.811,1.73c0,0.002,0.002,0.002,0.002,0.002c0.23,0.082,0.484-0.033,0.568-0.262c0.049-0.129,0.029-0.266-0.041-0.377l-1.219-2.586l1.447-3.932C18.435,7.768,17.085,4.676,14.38,3.467 M9.215,16.211c-0.658-0.234-1.054-0.869-1.014-1.523l2.784,0.998C10.588,16.215,9.871,16.447,9.215,16.211 M16.573,10.27l-1.51,4.1c-0.041,0.107-0.037,0.227,0.012,0.33l0.871,1.844l-4.184-1.506l-3.734-1.342l-4.185-1.504l1.864-0.857c0.104-0.049,0.188-0.139,0.229-0.248l1.51-4.098c0.916-2.487,3.708-3.773,6.222-2.868C16.187,5.024,17.489,7.783,16.573,10.27"></path></svg>
                    </div>
                  </router-link>
               </div>
               <div class="nav-item settings" :class="{active:currentPage==='/settings'}">
                  <router-link class="nav-link" to="/settings">
                    <div class="icon">
                        <svg class="svg-icon" viewBox="0 0 20 20"><path d="M17.498,11.697c-0.453-0.453-0.704-1.055-0.704-1.697c0-0.642,0.251-1.244,0.704-1.697c0.069-0.071,0.15-0.141,0.257-0.22c0.127-0.097,0.181-0.262,0.137-0.417c-0.164-0.558-0.388-1.093-0.662-1.597c-0.075-0.141-0.231-0.22-0.391-0.199c-0.13,0.02-0.238,0.027-0.336,0.027c-1.325,0-2.401-1.076-2.401-2.4c0-0.099,0.008-0.207,0.027-0.336c0.021-0.158-0.059-0.316-0.199-0.391c-0.503-0.274-1.039-0.498-1.597-0.662c-0.154-0.044-0.32,0.01-0.416,0.137c-0.079,0.106-0.148,0.188-0.22,0.257C11.244,2.956,10.643,3.207,10,3.207c-0.642,0-1.244-0.25-1.697-0.704c-0.071-0.069-0.141-0.15-0.22-0.257C7.987,2.119,7.821,2.065,7.667,2.109C7.109,2.275,6.571,2.497,6.07,2.771C5.929,2.846,5.85,3.004,5.871,3.162c0.02,0.129,0.027,0.237,0.027,0.336c0,1.325-1.076,2.4-2.401,2.4c-0.098,0-0.206-0.007-0.335-0.027C3.001,5.851,2.845,5.929,2.77,6.07C2.496,6.572,2.274,7.109,2.108,7.667c-0.044,0.154,0.01,0.32,0.137,0.417c0.106,0.079,0.187,0.148,0.256,0.22c0.938,0.936,0.938,2.458,0,3.394c-0.069,0.072-0.15,0.141-0.256,0.221c-0.127,0.096-0.181,0.262-0.137,0.416c0.166,0.557,0.388,1.096,0.662,1.596c0.075,0.143,0.231,0.221,0.392,0.199c0.129-0.02,0.237-0.027,0.335-0.027c1.325,0,2.401,1.076,2.401,2.402c0,0.098-0.007,0.205-0.027,0.334C5.85,16.996,5.929,17.154,6.07,17.23c0.501,0.273,1.04,0.496,1.597,0.66c0.154,0.047,0.32-0.008,0.417-0.137c0.079-0.105,0.148-0.186,0.22-0.256c0.454-0.453,1.055-0.703,1.697-0.703c0.643,0,1.244,0.25,1.697,0.703c0.071,0.07,0.141,0.15,0.22,0.256c0.073,0.098,0.188,0.152,0.307,0.152c0.036,0,0.073-0.004,0.109-0.016c0.558-0.164,1.096-0.387,1.597-0.66c0.141-0.076,0.22-0.234,0.199-0.393c-0.02-0.129-0.027-0.236-0.027-0.334c0-1.326,1.076-2.402,2.401-2.402c0.098,0,0.206,0.008,0.336,0.027c0.159,0.021,0.315-0.057,0.391-0.199c0.274-0.5,0.496-1.039,0.662-1.596c0.044-0.154-0.01-0.32-0.137-0.416C17.648,11.838,17.567,11.77,17.498,11.697 M16.671,13.334c-0.059-0.002-0.114-0.002-0.168-0.002c-1.749,0-3.173,1.422-3.173,3.172c0,0.053,0.002,0.109,0.004,0.166c-0.312,0.158-0.64,0.295-0.976,0.406c-0.039-0.045-0.077-0.086-0.115-0.123c-0.601-0.6-1.396-0.93-2.243-0.93s-1.643,0.33-2.243,0.93c-0.039,0.037-0.077,0.078-0.116,0.123c-0.336-0.111-0.664-0.248-0.976-0.406c0.002-0.057,0.004-0.113,0.004-0.166c0-1.75-1.423-3.172-3.172-3.172c-0.054,0-0.11,0-0.168,0.002c-0.158-0.312-0.293-0.639-0.405-0.975c0.044-0.039,0.085-0.078,0.124-0.115c1.236-1.236,1.236-3.25,0-4.486C3.009,7.719,2.969,7.68,2.924,7.642c0.112-0.336,0.247-0.664,0.405-0.976C3.387,6.668,3.443,6.67,3.497,6.67c1.75,0,3.172-1.423,3.172-3.172c0-0.054-0.002-0.11-0.004-0.168c0.312-0.158,0.64-0.293,0.976-0.405C7.68,2.969,7.719,3.01,7.757,3.048c0.6,0.6,1.396,0.93,2.243,0.93s1.643-0.33,2.243-0.93c0.038-0.039,0.076-0.079,0.115-0.123c0.336,0.112,0.663,0.247,0.976,0.405c-0.002,0.058-0.004,0.114-0.004,0.168c0,1.749,1.424,3.172,3.173,3.172c0.054,0,0.109-0.002,0.168-0.004c0.158,0.312,0.293,0.64,0.405,0.976c-0.045,0.038-0.086,0.077-0.124,0.116c-0.6,0.6-0.93,1.396-0.93,2.242c0,0.847,0.33,1.645,0.93,2.244c0.038,0.037,0.079,0.076,0.124,0.115C16.964,12.695,16.829,13.021,16.671,13.334 M10,5.417c-2.528,0-4.584,2.056-4.584,4.583c0,2.529,2.056,4.584,4.584,4.584s4.584-2.055,4.584-4.584C14.584,7.472,12.528,5.417,10,5.417 M10,13.812c-2.102,0-3.812-1.709-3.812-3.812c0-2.102,1.71-3.812,3.812-3.812c2.102,0,3.812,1.71,3.812,3.812C13.812,12.104,12.102,13.812,10,13.812"></path></svg>
                   </div>
                  </router-link>
               </div>
           </div>
       </div>
     </nav>
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name:"app-nav",
  data:()=>({
    profileMenu:false
  }),
  computed:{
    ...mapState(['user']),
    ...mapGetters(['getUnreadNotifCount']),
    currentPage(){
      return this.$route.path;
    }
  },
  methods:{
    ...mapMutations(['openEditor'])
  }
}

</script>

<style>


.svg-icon {
  width: 2em;
  height: 2em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: #ffffff;
}

.svg-icon circle {
  stroke: #ffffff;
  stroke-width:1;
}
a{
    display: block;
    text-decoration: none;
    color:inherit;
}
.main-nav{
    padding: 5px;
    background: black;
    display: flex;
    align-items: center;
    color: white;
}
.nav-container{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    max-width: 700px;
    margin: 0px auto;
}
.main-nav .nav-group{
    display: flex;
    align-items: center;
}
.nav-item{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    position: relative;
}
.nav-item.active{
  background: rgb(51, 51, 51) !important;
}

.nav-item.write-post svg path{
  stroke-width: 10px;
}

.nav-item:hover{
    background: rgb(48, 45, 45);
}
.nav-item-logo img{
    width: 100px;
    margin: 0px 10px;
}
.nav-item .icon img{
    width: 25px;
}
.nav-item .icon{
    position: relative;
    padding: 5px;
}

.icon .badge{
    position: absolute;
    top:0%;
    right:0%;
    width:15px;
    height:15px;
    background: tomato;
    border-radius: 50%;
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.profile-option-menu{
  position: absolute;
  z-index: 2;
  top:100%;
  right: 0%;
}
.menu{
  color: rgb(0, 0, 0);
  z-index: inherit;
  background: white;
  border-radius: 2px;
  overflow: hidden;

}

.menu-item{
  padding: 5px 10px;
  border-top:1px solid rgb(236, 230, 230);
  border-bottom:1px solid rgb(236, 230, 230);
  display: flex;
  align-items: center;
}
.menu-item:hover{
 background: rgb(231, 228, 228);
}
.menu-item .menu-item-label{
    font-size: 1.4em;
    margin: 0px 10px;
}
.menu-item svg path{
    fill: black;
}
@media screen and (max-width:600px) {
  .sm-bottom{
    position: fixed;
    bottom: 0px;
    width: 100%;
    right: 0px;
    left: 0px;
    z-index: 99;
    background: black;
    display: flex;
    justify-content: space-around;
  }
  .sm-bottom .nav-item{
    flex: 1;
  }
  .sm-bottom .nav-item.home{
    order: 1;
  }
  .sm-bottom .nav-item.write-post svg path{
    fill: black;
  }
  .sm-bottom .nav-item.write-post{
    order: 3;
    background: rgb(255, 255, 255);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    max-width: 50px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-10px);
    border: 2px solid black;
  }
  .sm-bottom .nav-item.Aliens{
    order: 2;
  }

  .sm-bottom .nav-item.settings{
     order: 5
  }
  .sm-bottom .nav-item.notifications{
     order: 4;
  }
}
</style>