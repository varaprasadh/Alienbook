const dotEnv=require('dotenv');
const mongoose = require('mongoose');


dotEnv.config();


let mongoURL;
if (process.env.NODE_ENV == 'production') {
    console.log("production");
    mongoURL = process.env.MONGO_DB_URL;
} else {
    mongoURL = process.env.MONGO_DEV_URL
    console.log("development");
}
console.log({
        mongoURL
});

const connection = mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
})

module.exports=connection;
