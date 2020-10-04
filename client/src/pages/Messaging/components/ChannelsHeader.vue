<template>
    <div class="chatlist-header">
        <div class="legend">AlienBook</div>
        <div class="actions">
            <div class="action new" @click="$emit('newChannel')">
                <div class="icon">
                    <Plus fillColor="blue"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Plus from "vue-material-design-icons/Plus";

export default {
  name:"chatlist-header",
  props:[],
  components:{
      Plus
  }
}
</script>

<style scoped>
.chatlist-header{
    height: 50px;
    border-bottom: 1px solid black;
    padding: 0.5em;
    display: flex;
    align-items: center;
}
.legend{
    flex: 1;
}
.action .icon{
    cursor: pointer;
}
.action{
    padding: 0.2em;
    border-radius: 50%;
    background: rgb(231, 242, 243);
    width: 1.5em;
    height: 1.5em;
}
.action:hover{
   filter: brightness(0.9);
}
.actions{
    display: flex;
}
</style>