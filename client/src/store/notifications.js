export default {
    namespaced:true,
    state:()=>({
        notifications: [],
    }),
    muatations: {
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
    actions: {

    },
    getters: {
        getUnreadNotifCount(state) {
            return state.notifications.reduce((sum, notif) => sum + (notif.read == false ? 1 : 0), 0)
        }
    },

}