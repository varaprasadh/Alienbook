const editorInitialState = {
    post: {},
    callback: null,
    type: "NORMAL",
    content: " "
}

export default {
    namespaced:true,
    state: {
        editorAuxData: editorInitialState,
        editorOpen: false,
    },
    actions: {
        publishPost({state,dispatch}){
          console.log(state.editorAuxData);
          dispatch("feed/publishPost",{...state.editorAuxData},{root:true});
        },
        updatePost({state,dispatch}){
          dispatch("feed/updatePost",{...state.editorAuxData},{root:true});
        },
        sharePost({state,dispatch}){
         dispatch("feed/sharePost",{...state.editorAuxData},{root:true});
        }
    },
    mutations: {
         openEditor(state, data={}) {
            let {post={content:" "},callback=()=>{},type="NORMAL",content=""}=data;
            console.log("debug",type);
            if(type==='EDIT'){
                content=post.content;
            }
            state.editorAuxData={post,callback,type,content}
            state.editorOpen =true;
        },
        closeEditor(state){
            state.editorAuxData = editorInitialState;
            state.editorOpen=false;
        },
    },
}

