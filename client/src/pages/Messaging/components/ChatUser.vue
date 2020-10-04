<template>
    <div class="user" @click="$emit('select',user)">
        <div class="avatar">
            <Avatar :src="user.avatar_url"/>
        </div>
        <div class="meta">
            <div class="username">{{user.username}}</div>
            <div class="fullname">{{user.full_name}}</div>
        </div>
    </div>
</template>

<script>
import Avatar from "@/components/Avatar";

export default {
  name:"chat-user",
  components:{
      Avatar
  },
  props:['user']
}
</script>

<style scoped>
.user{
    display: flex;
    padding: 0.2em;
    box-sizing: border-box;
    cursor: pointer;
    border-bottom: 1px solid rgb(240, 230, 230);
}
.user:hover{
    background: rgb(204, 231, 227);
}
.meta{
    margin-left: .3em;
}
.meta .username{
    font-size: 1em;
}
.meta .fullname{
    font-size: .7em;
}

</style>