import Axios from "axios";


export default {
    namespaced:true,
    state: {
      notifications:[],
      loading:false,
      completed:false,
      skip:0
    },
    actions: {
        loadNotifications({commit,state}){
        if(state.loading ||state.completed) return;
        state.loading=true;
        Axios.get("/notifications").then(({data})=>{
            commit('setNotifications',data.data);
            state.loading=false;
            state.skip+=20;
            state.completed=data.completed;
        }).catch(()=>{
            state.loading=false;
        });
        }
    },
    mutations: {
        setNotifications(state, notifications) {
            state.notifications.push(...notifications)
        },
        removeNotification(state, id) {
            let index = state.notifications.findIndex(n => n.notification_id === id);
            if (index != -1) {
                state.notifications.splice(index, 1);
            }
        },
    },
    getters: {
        getUnreadNotifCount(state) {
            return state.notifications.reduce((sum, notif) => sum + (notif.read == false ? 1 : 0), 0)
        }
    }
}