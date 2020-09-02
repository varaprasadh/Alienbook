<template>
    <div class="chatlist-item">
        <div class="chatlist-item-avatar">
            <img src="../assets/Avatar.png" alt="avatar">
        </div>
        <div class="chatlist-item-content">
            <div class="thread-name">John doe</div>
            <div class="last-message">hello,are you there</div>
        </div>
        <div class="info-extras">
            <div class="online-tag">online</div>
        </div>
    </div>
</template>

<script>
export default {
   name:"chatlist-item"
}
</script>

<style scoped> 
.chatlist-item-avatar{
    width: 50px;
    height: 50px;
}
.chatlist-item-avatar img{
    width: 100%;
    height: 100%;
}
.chatlist-item{
    display: flex;
    padding: 0.3em;
    border-bottom: 1px solid rgb(219, 213, 213);
    cursor: pointer;
}
.chatlist-item-content{
    padding: 0px 0px 0px 10px;
    flex: 1;
}
.chatlist-item-content .thread-name{
    font-weight: bold;
    font-size: 1.2em;
}
.info-extras{

}
.online-tag{
    color: rgb(7, 165, 7);
}

</style>