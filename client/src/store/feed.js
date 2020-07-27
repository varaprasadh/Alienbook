import Axios from "axios";

export default {
    namespaced:true,
    state:()=>({
        feed: [],
        completed:false,
        skip:0,
        loading:false
    }),
    muatations:{
        setFeedPosts(state, posts) {
            state.feed.push(...posts);
        },
        setNewFeed(state, posts) {
            state.feed.unshift(...posts);
        },
        removeFromFeed(state, postId) {
            const index = state.feed.findIndex(post => post.id === postId);
            if (index != -1) {
                state.feed.splice(index, 1);
            }
        },
    },
    actions:{
        loadFeed({commit,state}){
            if (state.loading || state.completed) {
                return;
            }
            state.loading=true;
            Axios.get("/posts",{params:{skip:state.skip}}).then(({data})=>{
                commit("setFeedPosts", data.posts)
                state.completed=data.completed;
                state.skip+=20;
            }).catch(()=>{}).finally(()=>{
                state.loading=false;
            })
        },
    },

    getters:{

    },

}