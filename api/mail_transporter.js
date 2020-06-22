"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();

    let account = {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASS
    };

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        auth: {
            user: process.env.APP_EMAIL, //username or email
            pass: process.env.APP_EMAIL_PASS //password
        },
        service:"gmail"
    });

    module.exports=transporter



