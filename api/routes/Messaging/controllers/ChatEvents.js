const socketio = require('socket.io');


class ChatEvents{
    constructor(server){
       this.io = socketio(server, {
           handlePreflightRequest: (req, res) => {
               const headers = {
                   "Access-Control-Allow-Headers": "Content-Type, Authorization",
                   "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
                   "Access-Control-Allow-Credentials": true
               };
               res.writeHead(200, headers);
               res.end();
           }
       });
    }
    initialise(){
         
        this.io.on('connection', socket => {
            console.log("client connected", socket.id);
            socket.on("JOIN",user_id=>{
                this.join(user_id,socket);
            });
            socket.on("message:create",request=>{
               this.onMessage(request,socket);
            });
            socket.on("message:delete",request=>{
                this.onDeleteMessage(request,socket);
            });
            socket.on("message:read",request=>{
                this.onMessageRead(request,socket);
            });
    

        });
    }
    join(user_id,socket){
        socket.join(user_id);
    }
    
    onMessage(request){
       const {user_id,conversation_id,participents,content}=request;
    }
    onDeleteMessage(){

    }

    onDeleteConversation(){
     
    }
    onMessageRead(){

    }



    /*
     * @param type:type of event
     * @param payload:the data
     * @param users :Array<user_id>  
     * @return :void
     */

    publish(type,payload,users){
       users.forEach(user_id => {
         //user_id is probably the room_id
         this.io.to(user_id).emit(type,payload);
       }); 
    }

}
module.exports=ChatEvents;

