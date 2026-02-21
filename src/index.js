// import dotenv from "dotenv"
// import dns from 'dns';
// import connectDB from "./db/index.js";
// dns.setDefaultResultOrder('ipv4first');
// dotenv.config({
//     path: "./.env"
// });


// console.log('=================================');
// console.log('🔍 Environment Variables Check:');
// console.log('MONGO_URL:', process.env.MONGO_URL || '❌ UNDEFINED');
// console.log('PORT:', process.env.PORT || '❌ UNDEFINED');
// console.log('=================================');
// connectDB()

import './config/dotenv.config.js';


import dns from 'dns';
import connectDB from "./db/index.js";
import {app} from "./app.js"

// Force IPv4
dns.setDefaultResultOrder('ipv4first');



// console.log('=================================');
// console.log('🔍 Environment Variables Check:');
// console.log('MONGO_URL:', process.env.MONGO_URL || '❌ UNDEFINED');
// console.log('PORT:', process.env.PORT || '❌ UNDEFINED');
// console.log('=================================');

connectDB()
.then(
    ()=>{
        app.on("error",(err)=>{
            console.log("Error starting server , error:", err.message);
            throw err;
        })
        app.listen(process.env.PORT,()=>
        {
            console.log(`server is runnning on port ${process.env.PORT}`)
        })
    }
)
.catch((err)=>{
    console.log("Error starting server:------", err.message);
})