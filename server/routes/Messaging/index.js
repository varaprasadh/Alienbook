
const express=require('express');
const http=require('http');
const cors=require('cors');
const ChatEvents=require("./controllers/ChatEvents");
const ConversationRouter=require("./Router/conversation");

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(ConversationRouter);

const server=http.createServer(app);



const events = new ChatEvents(server);
events.initialise();

server.listen(3001,()=>{
  console.log(`chat service is running on`,server.address());
})

module.exports=app;
