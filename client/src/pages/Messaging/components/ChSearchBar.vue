<template>
  <div class="searchbar-wrapper">
      <input type="text" class="search-input" placeholder="search conversation">
      <div class="icon search">
         search
      </div>
  </div>
</template>

<script>
export default {
   name:"channel-searchbar"
}
/*
 search by usernames
 but we have user ids

 get all users matching with username and ids
 search conversations 
          with pariticpents [current user id,]
*/
</script>

<style scoped>
.searchbar-wrapper{
    display: flex;
    align-items: center;
    border: 1px solid gray;
    box-sizing: border-box;
    padding: 5px;
    margin-top: 5px;
    border-radius: 5px;
}
.search-input{
  flex: 1;
  border: none;
  font-size: 1em;
  padding: 0.2em;
  outline: none;
}
.icon.search{
  cursor: pointer;
}
</style>
