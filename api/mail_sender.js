
const transporter=require("./mail_transporter");


    let options = {
        from: '"intellias.consiousverse@gmail.com', // sender address
        to: "varaprasadh.a@gmail.com", // list of receivers
        subject: "reset password support", // Subject line
        text: `please click the below link to reset your password ${link}`, // plain text body
        html: `<b>please click the below link to reset your password</b> <a href=${link}>click here</a>`, // html body
    }
    // send mail with defined transport object
   transporter.sendMail(options).then((data)=>{
       console.log("mail sent", data);
   }).catch(err=>{
       console.log("didnt sent", err);
   })

