import Axios from "axios";

const editorInitialState = {
    post: {},
    callback: null,
    type: "NORMAL",
    content: " ",
    images:[] // files 
}

export default {
    namespaced:true,
    state: {
        editorAuxData: editorInitialState,
        editorOpen: false,
        loading:false
    },
    getters:{
      images(state){
          return state.editorAuxData.images
      }
    },
    actions: {        
        publishPost({state,commit,dispatch}){
           const {content,images} =state.editorAuxData;
           if(content.trim()===""){
               return;
           }
           commit("runLoading");
           const formData=new FormData();
           formData.append('content', content);
           for(const image of images){
               formData.append('images', image);
           }
           Axios.post("/posts/create", formData, {
               headers:{
                   'Content-Type': 'application/json'
               }
           }).then(({data})=>{
               dispatch("feed/publishPost",{post:data.post},{root:true});
               commit("closeEditor");
           }).catch(()=>{
               //show error
           }).finally(()=>{
                commit("stopLoading");
           })
   
        },
        //should be inline with in the post component 
        updatePost({state,commit,dispatch}){
            const {content,post,callback}=state.editorAuxData;
            let data={content,postid:post.id};
            commit("runLoading");
            Axios.post("/posts/update",data).then(({data})=>{
                dispatch("feed/updatePost",{callback,post:data.post},{root:true});
                commit("closeEditor");
            }).catch(()=>{
                  //show error
            }).finally(()=>{
                commit("stopLoading");
            })
        },

        sharePost({state,dispatch,commit}){
            const {content,post,callback}=state.editorAuxData;
            //if its a normal post
            let postid,username,owner;
            if(post.type==='NORMAL'){
                postid=post.id;
                username = post.authorName;
                owner=post.author;
            }else{
                //if its already shared one,then use orginalpost data
                postid = post.originalPost.id;
                username = post.originalPost.authorName;
                owner = post.originalPost.author;
            }
            let data={content,postid,username,owner};
            commit("runLoading");
            Axios.post("/post/share",data).then(({data})=>{
                dispatch("feed/sharePost",{callback,post:data.post},{root:true}); 
                commit("closeEditor");
            }).catch(()=>{

            }).finally(()=>{
                  commit("stopLoading");
            })
        }
    },
    mutations: {
        openEditor(state, data={}) {
            let {post={content:" "},callback=()=>{},type="NORMAL",content=""}=data;
            console.log("debug",type);
            if(type==='EDIT'){
                content=post.content;
            }
            state.editorAuxData={...state.editorAuxData,post,callback,type,content}
            state.editorOpen =true;
        },
        closeEditor(state){
            state.editorAuxData = editorInitialState;
            state.editorOpen=false;
        },
        runLoading(state){
            state.loading=true;
        },
        stopLoading(state){
            state.loading=false;
        },
        addImage(state,file){
          state.editorAuxData.images.push(file);
        },
        removeImage(state,index){
            state.editorAuxData.images.splice(index, 1);
        }
    },
}

