const badWordFilter=require('bad-words');

module.exports=(req,res,next)=>{
    const emojies = ['😂', '😋', '😎', '😍'];
    const randomIndex = Math.floor(Math.random() * emojies.length);
    const {content}=req.body;
    const filter = new badWordFilter({placeHolder:emojies[randomIndex]});
    req.body.content=filter.clean(content);
    next();
}

