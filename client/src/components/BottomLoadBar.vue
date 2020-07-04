<template>
    <div class="loading">
        <div class="loading-bar">
            <div class="loading-line"></div>
        </div>
    </div>
</template>

<script>
export default {
   name:"loading-bar-bottom"
}
</script>

<style scoped>
.loading{
  text-align: center;
  padding: 10px;
  background: white;
}

.loading-bar{
  width: 100%;
  height: 5px;
  overflow: hidden;
  position: relative;
}
.loading-line{
  position: absolute;
  animation: load 1s cubic-bezier(0.77, 0, 0.175, 1) infinite alternate-reverse;
  background: rgb(179, 175, 175);
  height: 100%;
}

@keyframes load{
  from{
     left:0%;
     width:20%;
  }
  to{
    left:100%;
    width: 100%;
  }
}
</style>