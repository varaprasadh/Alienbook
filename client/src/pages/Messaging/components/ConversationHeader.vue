<template>
    <div class="converation-header">
        <div class="avatar">
            <img src="../assets/Avatar.png" alt="avatar">
        </div>
        <div class="conversation-header-info">
            <div class="username">John doe</div>
            <div class="last-seen">aug 3rd</div>
        </div>
        <div class="conversation-actions">
            <div class="icon">
                <MenuIcon/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
   name:"conversation-header",
}
</script>

<style scoped>
 .converation-header{
       display: flex;
       padding: 0.5em;
       align-items: center;
       border-bottom: 1px solid rgb(187, 182, 182);
   }
   .converation-header .avatar{
       width: 50px;
       height: 50px;
   }
   .converation-header .avatar img{
       width: 100%;
       height: 100%;
   }
   .conversation-header-info{
       flex: 1;
       padding-left: 10px;
   }
  .conversation-header-info .username{
      font-weight: bold;
      font-size: 1.2em;
 }
</style>