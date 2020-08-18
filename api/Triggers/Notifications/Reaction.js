const dotEnv = require('dotenv');
const mongoose = require('mongoose');

const connection=require("../../dbconnection");
const Reaction =require("../../models/Reaction");

const fs=require("fs");
const path=require('path');

connection.then(conn=>{ 
    //start listening for change streams and generate notifications
    Reaction.watch().on('change',change=>{
        console.log(change);
        // fs.writeFileSync(`/home/varaprasadh/Desktop/logs/${Date.now()}.json`, JSON.stringify(change));
    })
    
}).catch(err=>{
    console.log("db error",err);
})
