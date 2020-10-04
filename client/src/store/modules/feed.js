/* eslint-disable no-unused-vars */
import Axios from "axios";

export default {
    namespaced:true,
    state:{
        posts: [],
        skip:0,
        completed:false,
        loading:false,
        scrollPosition:{x:0,y:0}
    },

    actions:{
        loadFeed({commit,state}) {
            if (state.loading || state.completed) {
                return;
            }
            state.loading = true;
            Axios.get("/posts", {params: {skip: state.skip}}).then(({data}) => {
                commit('setPosts',data.posts);
                state.completed = data.completed;
                state.skip += 20;
            }).catch(() => {}).finally(() => {
                state.loading = false;
            })
        },
        publishPost({commit},{post}){
            commit("setNewPost", [post]);
        },
        updatePost({commit},{callback,post}){
            callback(post);
        },
        sharePost({commit},{callback,post}){
            commit("setNewPost", [post]);
            callback(post);
        }
    },
    mutations:{
        setPosts(state, posts) {
                state.posts.push(...posts);
        },
        setNewPost(state, posts) {
            state.posts.unshift(...posts);
        },
        removeFromPosts(state, postId) {
            const index = state.posts.findIndex(post => post.id === postId);
            if (index != -1) {
                state.posts.splice(index, 1);
            }
        },
        setScrollPostion(state,{x,y}){
            console.log("setting",x,y);
            state.scrollPosition.x=x;
            state.scrollPosition.y=y;
        }
    },
}