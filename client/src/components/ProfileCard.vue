<template>
    <div class="profile-card">
        <div class="profile-main">
            <div class="image">
                <img src="../assets/png/alien_black.png" alt="alien">
            </div>
            <div class="meta">
                <div class="info">
                <div class="username">{{user.username}}</div>
                <div class="fullname">{{user.fullName}}</div>
                <div class="generated-slogan">became an alien on <span class="date">{{new Date(user.createdAt).toLocaleDateString()}}</span></div>
                </div>
            </div>
        </div>
        <div class="activity-info">
            <router-link class="activity followers" :to="'/profile/'+user.username+'/followers'">
                <div class="count">{{user.followers}}</div>
                <div class="label">Followers</div>
            </router-link>
            <router-link class="activity following" :to="'/profile/'+user.username+'/following'">
                <div class="count">{{user.following}}</div>
                <div class="label">Following</div>
            </router-link>
            <div class="activity posts">
                <div class="count">{{user.posts}}</div>
                <div class="label">Posts</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name:"profile-card",
  props:['user']
}
</script>

<style>
.profile-card{
   padding: 10px;
   background: white;
 }
 .profile-card .image img{
   width: 100px;
 }
 .profile-main{
   display: flex;
   align-items: center;
 }
 .profile-card .meta{
   margin-left: 1rem;
   display: flex;
   flex: 1;
 }
 .meta .username{
   font-weight: bold;
   font-size: 1.5rem;
 }
 .meta .fullname{
   font-weight: bold;
   color: rgb(145, 141, 141);
   padding: 5px 0px;
 }
 .activity{
   text-align: center;
 }
 .activity-info{
   display: flex;
   justify-content: space-around;
   padding: 10px;
 }
 .activity .label{
    font-weight: bold;
 }
 .activity .count{
  font-weight: bold;
  font-size: 1.2rem;
 }
 .generated-slogan{
   font-size: 1.2em;
   color: rgb(46, 43, 43);
 }
 .generated-slogan .date{
   font-weight: bold;
 }
</style>