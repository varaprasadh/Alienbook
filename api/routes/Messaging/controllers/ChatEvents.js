const socketio = require('socket.io');


class ChatEvents{
    constructor(){
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
                socket.join(user_id);
            });
        });
    
    }

}
module.exports=ChatEvents;

