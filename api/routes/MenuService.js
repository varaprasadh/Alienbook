const Router = require('express').Router();


//abmi:type:item_id
Router.get("/menu/:_id",(req,res)=>{
    const {_id}=req.params._id;
    
})

module.exports = Router;