
const express=require('express');
const socketio=require('socket.io');
const http=require('http');


const app=express();

const server=http.createServer(app);
const io=socketio(server);

io.on('connection',socket=>{
    console.log("client connected",socket.id);
});


server.listen(3001,()=>{
    console.log(`chat running on port ${3001}`);
})
module.exports=app;



//on selected user
/*
-generate join room
  - check if room exists, or create one

*/