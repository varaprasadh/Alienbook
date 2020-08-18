const dotEnv=require('dotenv');
const mongoose = require('mongoose');


dotEnv.config();


let mongoURL;
if (process.env.mode == 'production') {
    mongoURL = process.env.MONGO_DB_URL;
} else {
    mongoURL = process.env.MONGO_DEV_URL
}

const connection = mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
})

module.exports=connection;
