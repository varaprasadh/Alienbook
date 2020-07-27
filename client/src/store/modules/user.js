import Axios from "axios";

export default {
    namespaced:true,
    state:{
      user:null
    },
    actions: {
        loadUserInfo({commit}){
            commit('runLoader',null,{root:true})
            Axios.get("/users/profile").then(({data})=>{
                commit('setUser',data.data);
                commit('stopLoader',null,{root:true});
            }).catch(()=>{
                commit('stopLoader',null,{root:true});
                commit('logout',null,{root:true});
            })
        },
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    }
}